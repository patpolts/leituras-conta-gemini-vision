export interface IImageProvider{
    upload(data:any): Promise<any>;
    info(data:any): Promise<any>;
}