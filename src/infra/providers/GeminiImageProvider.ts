import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import {IImageProvider} from '@application/providers/IImageProvider'
import { enviroments } from "@config/enviroments";
import fs from 'fs';
import {delay} from 'bluebird'

export class GeminiImageProvider implements IImageProvider{
    file: any;
    fileManager: any;
    genAI: any;

    constructor(){
        this.fileManager = new GoogleAIFileManager(enviroments.apiKey);
        this.genAI = new GoogleGenerativeAI(enviroments.apiKey);
    }
    

    async upload(data: any): Promise<any> {
        if(!data.image) throw new Error("INVALID_DATA");

        await delay(1000);

        let filePath:string;

        const image = data.image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(image, 'base64');
            filePath = `uploads/${Date.now()}-image.jpg`;
            fs.writeFileSync(filePath, buffer);

        const response = await this.fileManager.uploadFile(filePath, {
            mimeType: data.mimeType || 'image/jpeg',
            displayName: data.displayName || 'Meter Reading',
        });

        console.log(response)

        if(response.file.uri && response.file.mimeType){
            return this.info({
                uri: response.file.uri,
                mimeType: response.file.mimeType
            });
        }
    
        
    }

    async info(data: any): Promise<any> {
        await delay(1000);

        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-pro"
        });

        const response = await model.generateContent([
            {
                fileData: {
                    mimeType: data.mimeType,
                    fileUri: data.uri
                }
            },
            {
                text: `Analyze the image and provide the following information:
                    - The reading number from the meter.`
            }
        ]);

        const info = response?.response?.text();
        
        if(info){
            let findNumber = info.match(/\d+/g);
            let readingNumber = findNumber ? parseInt(findNumber[0], 10) : 0;

            return {
                uri: data.uri,
                reading: readingNumber
            }

        }else{
            throw {
                'error_code': 'INVALID_DATA',
                "error_descrition": "Erro inesperado!"
            }
        }
        
        
    }
}