import { IReadingsRepository } from "@application/repositories/IReadingsRepository";
import { IGetReadingsDTO } from "./GetReadingsDTO";

export class GetReadingsCase{
    constructor(
        private uploadsRepository: IReadingsRepository
    ){}

    async execute(data: IGetReadingsDTO): Promise<any>{
        const response = data.measure_type ? 
            await this.uploadsRepository.list({code: data.customer_code, readingType: data.measure_type.toUpperCase()})
                : await this.uploadsRepository.list({code: data.customer_code});

        
        if(!response){
            return 404
        }

        let results:any = [];

        response.map((res:any) => {
            results.push({
                "measure_uuid": res.uuid,
                "measure_datetime": res.readingDatetime,
                "measure_type": res.readingType,
                "has_confirmed": res.readingConfirmed,
                "image_url": res.image
            })
        });

        return {
            "customer_code": data.customer_code,
            "measures": results
        };
    }
}