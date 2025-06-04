import { Request, Response } from "express";
import { PatchConfirmCase } from "./PatchConfirmCase";


function isValidString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}
  
function isValidInteger(value: any): boolean {
    return typeof value === 'number' ;
}
  
export class PatchConfirmController{
    constructor(
        private patchConfirmCase: PatchConfirmCase
    ){}

    async handle(req: Request, res: Response): Promise<any>{
        try {
            const {measure_uuid,confirmed_value} = req.body;

            if(!isValidString(measure_uuid)){
                return res.status(400).json({ 
                    error_code: 'INVALID_DATA',
                    error_description: 'Verifique se o campo measure_uuid é  do tipo string válida.' 
                });
            }

            if(!isValidInteger(confirmed_value)){
                return res.status(400).json({ 
                    error_code: 'INVALID_DATA',
                    error_description: 'Verifique se o campo confirmed_value é integer válido.' 
                });

            }

            const result = await this.patchConfirmCase.execute({
                measure_uuid,confirmed_value
            });
            
            if(result == 409) return res.status(409).json({
                "error_code": "CONFIRMATION_DUPLICATE",
                "error_description": "Leitura do mês ja realizada ou já confirmada!"
            });

            if(result == 404) return res.status(404).json({
                "error_code": "MEASURE_NOT_FOUND",
                "error_description": "Leitura do mÊs ja realizada ou não encontrada!"
            });

            return res.status(200).json(result);

        } catch (error) {
            console.error(error);
            return res.json(error);
            
        }
    }
}