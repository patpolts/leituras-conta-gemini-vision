import { Request, Response } from "express";
import { GetReadingsCase } from "./GetReadingsCase";

function isValidMeasureType(type: string): boolean {
    const validTypes = ['WATER', 'GAS'];
    return validTypes.includes(type.toUpperCase());
}

export class GetReadingsController{
    constructor(
        private getReadingsCase: GetReadingsCase
    ){}

    async handle(req: Request, res: Response): Promise<any>{
        try {
            const {customer_code} = req.params;
            const {measure_type}:any = req.query;
            
            if(measure_type && !isValidMeasureType(measure_type)){
                return res.status(400).json({
                    "error_code": "INVALID_TYPE",
                    "error_description": `Tipo de medição (${measure_type}) inválida!`
                })

            }

            const result = await this.getReadingsCase.execute({
                customer_code,measure_type
            });
            
            if(result == 404){
                return res.status(404).json({
                    "error_code": "MEASURE_NOT_FOUND",
                    "error_description": `Nenhuma leitura encontrada para código ${customer_code} nessa medição!`
                })
            }

            return res.status(200).json(result);

        } catch (error) {
            return res.json(error);
            
        }
    }
}