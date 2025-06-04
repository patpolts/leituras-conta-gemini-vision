import { IReadingsRepository } from "@application/repositories/IReadingsRepository";
import { IPatchConfirmDTO } from "./PatchConfirmDTO";


export class PatchConfirmCase{
    constructor(
        private uploadsRepository: IReadingsRepository,
    )
    {}

    async execute(data:IPatchConfirmDTO):Promise<any>{
        const check = await this.uploadsRepository.findByMeasure({
            uuid: data.measure_uuid
        });

        if(!check){
            return 404;
        }
        
        if(check?.readingConfirmed){
            return 409;

        }

        const checkValue = data.confirmed_value === check.reading ? 
            await this.uploadsRepository.update({readingConfirmed: true},data.measure_uuid)
            : this.uploadsRepository.update({reading: data.confirmed_value ,readingConfirmed: true},data.measure_uuid);
        
        
        return checkValue ? {"success": true} : {"success": false};


    }
}