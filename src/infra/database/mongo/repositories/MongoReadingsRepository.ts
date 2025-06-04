import { IReadingsRepository } from '@application/repositories/IReadingsRepository';
import { v4 as uuidv4 } from 'uuid';
import mongoose, { Document, Schema } from 'mongoose';
import { connection } from "@config/mongoDB";
import { enviroments } from "@config/enviroments";
import { Reading } from '@application/entities/Reading';

export const readingSchema: Schema = new mongoose.Schema({
    uuid: { type: String },
    code: { type: String },
    image: { type: String },
    reading: { type: Number },
    readingDatetime: { type: Date },
    readingType: { type: String },
    readingConfirmed: { type: Boolean },
}, { strict: true, timestamps: true });

export const readingModel = mongoose.model('reading', readingSchema);

export class MongoReadingsRepository implements IReadingsRepository {
    public reading: Reading | any;
    constructor() {
    }

    async connection() {
        try {
            await connection;
            console.log('Conectado ao MongoDB com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    async findByCode(filter: any): Promise<Reading | any> {
        try {
            this.connection();

            const datetime = new Date(filter.datetime);
            const startOfMonth = new Date(datetime.getFullYear(), datetime.getMonth(), 1);
            const endOfMonth = new Date(datetime.getFullYear(), datetime.getMonth() + 1, 0, 23, 59, 59, 999);

            const docs = await readingModel.find({
                code: filter.code,
                readingType: filter.measure,
                readingDatetime: {
                    $gte: startOfMonth,
                    $lte: endOfMonth,
                },
            }).exec();

            if (docs.length > 0) {
                const readings = docs.map((doc) => {
                    this.reading = new Reading({
                        uuid: doc.uuid,
                        code: doc.code,
                        image: doc.image,
                        reading: doc.reading,
                        readingDatetime: doc.readingDatetime,
                        readingType: doc.readingType,
                        readingConfirmed: false
                    })
                });

                return this.reading;

            } else {
                return null;

            }

        } catch (error) {
            throw error
        }
    }

    async findByMeasure(measure: any): Promise<any> {
        try {
            this.connection();

            const docs = await readingModel.find({ uuid: measure.uuid }).exec();

            if (docs.length > 0) {
                const readings = docs.map((doc) => {
                    this.reading = new Reading({
                        uuid: doc.uuid,
                        code: doc.code,
                        image: doc.image,
                        reading: doc.reading,
                        readingDatetime: doc.readingDatetime,
                        readingType: doc.readingType,
                        readingConfirmed: doc.readingConfirmed
                    })
                });

                return this.reading;

            } else {
                return null;

            }

        } catch (error) {
            throw error
        }
    }

    async list(filter: any): Promise<any> {
        try {
            this.connection();

            const docs = await readingModel.find(filter).exec();

            if (docs.length > 0) {
                return docs;

            } else {
                return null;

            }

        } catch (error) {
            throw error

        }
    }
    
    async save(reading: Reading): Promise<Reading | string> {
        try {
            this.connection();

            const uuid = uuidv4();
            const create = new readingModel({
                uuid: uuid,
                reading: reading.reading,
                code: reading.code,
                image: reading.image,
                readingType: reading.readingType,
                readingDatetime: reading.readingDatetime,
                readingConfirmed: false
            });

            const doc = await create.save();

            this.reading = new Reading({
                uuid: doc.uuid,
                code: doc.code,
                image: doc.image,
                reading: doc.reading,
                readingDatetime: doc.readingDatetime,
                readingType: doc.readingType,
                readingConfirmed: false
            });

            return this.reading;
        } catch (error) {
            console.error(`Erro ao salvar dados no banco: ${error}`);
            throw error;
        }

    }

    async update(reading: any, id: string): Promise<any> {
        try {
            this.connection();

            const result = await readingModel.updateOne(
                { uuid: id },
                { $set: reading }
            ).exec();

            return result.modifiedCount > 0 ? true : false;

        } catch (error) {
            console.error('Erro ao atualizar documento:', error);
            throw error;
        }
    }

}