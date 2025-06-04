import { Request, Response } from "express";
import { PostUploadCase } from "./PostUploadCase";

function isValidString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}
  
function isValidMeasureType(type: string): boolean {
    const validTypes = ['WATER', 'GAS'];
    return validTypes.includes(type.toUpperCase());
}
  
function isValidDateTime(value: string): boolean {
    const date = Date.parse(value);
    return !isNaN(date);
}

function isValidBase64(image: string): boolean{
    const base64PrefixRegex = /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/;
    const hasPrefix = base64PrefixRegex.test(image);
    const base64Data = hasPrefix ? image.replace(base64PrefixRegex, '') : image;
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    if (!base64Regex.test(base64Data) || base64Data.length % 4 !== 0) {
        return false;
    }

    return true;
}

export class PostUploadController{
    constructor(
        private postUploadCase: PostUploadCase
    ){}

    async handle(req: Request, res: Response): Promise<any>{
        try {
            const { image,customer_code,measure_datetime,measure_type } = req.body;
            
            if (!image || !isValidBase64(image)) {
                return res.status(400).json({ 
                    error_code: 'INVALID_DATA',
                    error_description: 'Verifique se o campo imagem foi enviado e se é  do tipo string base64' 
                });
            }

            if (!isValidString(customer_code)) {
                return res.status(400).json({
                  error_code: 'INVALID_DATA',
                  error_description: 'Verifique se o campo customer_code é uma string válida.'
                });
            }
    
            if (!isValidMeasureType(measure_type)) {
                return res.status(400).json({
                    error_code: 'INVALID_DATA',
                    error_description: 'O campo measure_type deve ser "WATER" ou "GAS".'
                });
            }
    
            if (!isValidString(measure_datetime) || !isValidDateTime(measure_datetime)) {
                return res.status(400).json({
                    error_code: 'INVALID_DATA',
                    error_description: 'O campo measure_datetime deve ser uma data e hora válida no formato ISO 8601.'
                });
            }

            const result = await this.postUploadCase.execute({ 
                image,customer_code,measure_datetime,measure_type
            });

            if(result == 409) return res.status(409).json({
                "error_code": "DOUBLE_REPORT",
                "error_descrition": "Leitura do mês já foi realizada!"
            })

            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.json(error);
        }
    }
    
}