import { MongoReadingsRepository } from "@infra/database/mongo/repositories/MongoReadingsRepository";
import { PostUploadCase } from "./PostUploadCase";
import { PostUploadController } from "./PostUploadController";
import { GeminiImageProvider } from "@infra/providers/GeminiImageProvider";

const imageProvider = new GeminiImageProvider();
const uploadsRepository = new MongoReadingsRepository();
const postUploadCase = new PostUploadCase(uploadsRepository,imageProvider);
const postUploadController = new PostUploadController(postUploadCase);

export {postUploadCase,postUploadController}