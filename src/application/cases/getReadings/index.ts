import { MongoReadingsRepository } from "@infra/database/mongo/repositories/MongoReadingsRepository";
import { GetReadingsCase } from "./GetReadingsCase";
import { GetReadingsController } from "./GetReadingsController";

const uploadsRepository = new MongoReadingsRepository();
const getReadingsCase = new GetReadingsCase(uploadsRepository);
const getReadingsController = new GetReadingsController(getReadingsCase);

export {getReadingsCase,getReadingsController}