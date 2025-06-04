import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IReadingsRepository } from '@application/repositories/IReadingsRepository'
import { IImageProvider } from '@application/providers/IImageProvider';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { enviroments } from '@config/enviroments';
import {IPostUploadDTO} from './PostUploadDTO'

export class PostUploadCase{
    constructor(
        private uploadsRepository: IReadingsRepository,
        private imageProvider: IImageProvider
    )
    {}

    async execute(data:IPostUploadDTO):Promise<any>{
        const check = await this.uploadsRepository.findByCode({
            code: data.customer_code,
            measure: data.measure_type,
            datetime: data.measure_datetime

        }); 

        if(!check){
            const response = await this.imageProvider.upload({
                image: data.image
            })
            
            if(response instanceof Error){
                throw {
                    "error_code": "INVALID_DATA",
                    "error_description": `Erro na IA: ${response}`
                }
            }

            console.log('leitura',response.reading)
            if(response.reading == 0){
                throw {
                    "error_code": "INVALID_DATA",
                    "error_description": "Erro ao fazer leitura!"
                }

            }
            
            const save = await this.uploadsRepository.save({
                uuid: null,
                code: data.customer_code,
                image: response.uri,
                reading: response.reading,
                readingType: data.measure_type,
                readingConfirmed: false,
                readingDatetime: data.measure_datetime
            });

            if(save instanceof Error || !save?.uuid){
                throw {
                    "error_code": "INVALID_DATA",
                    "error_descrition": "Houve um erro ao tentar salvar a leitura, verifique os dados enviados!"
                }
            }
            
            return {
                "image_url": response.uri,
                "measure_value": response.reading,
                "measure_uuid": save.uuid
            }

        }else{
            return 409
        }

    }
}