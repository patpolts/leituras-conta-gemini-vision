import { MongoReadingsRepository } from "@infra/database/mongo/repositories/MongoReadingsRepository";
import { PatchConfirmController } from "./PatchConfirmController";
import { PatchConfirmCase } from "./PatchConfirmCase";


const uploadsRepository = new MongoReadingsRepository();
const patchConfirmCase = new PatchConfirmCase(uploadsRepository);
const patchConfirmController = new PatchConfirmController(patchConfirmCase);

export {patchConfirmCase,patchConfirmController}