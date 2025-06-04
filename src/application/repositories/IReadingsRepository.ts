import { Reading } from "@application/entities/Reading";

export interface IReadingsRepository{
    findByCode(filter:any): Promise<any>;
    findByMeasure(measure:any): Promise<any>;
    save(reading: Reading): Promise<any>;
    update(reading: any,id:string): Promise<any>;
    list(filter: any): Promise<any>;
}