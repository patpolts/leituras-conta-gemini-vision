import { IfUnknown } from 'mongoose';

export class Reading{
    public uuid: string|unknown;
    public code: string|unknown;
    public image: string|unknown;
    public reading: number|unknown;
    public readingType: string|unknown;
    public readingConfirmed:boolean|unknown;
    public readingDatetime: Date|unknown;

    constructor(props: Reading) {
        Object.assign(this, props);

        
    }
}