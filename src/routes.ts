import { postUploadController } from "@application/cases/postUpload";
import { Router } from "express";
import { upload } from '@config/multer';
import { patchConfirmController } from "@application/cases/patchConfirm";
import { getReadingsController } from "@application/cases/getReadings";

const router = Router();

router.get('/', async (req,res) => {
    return res.status(200).json("API Leitura de contas com Gemini Vision");
});

router.post('/upload', upload.single('file'), async (req, res) => {
    return await postUploadController.handle(req,res);
});

router.patch('/confirm', async (req, res) => {
    return await patchConfirmController.handle(req,res);
});

router.get('/:customer_code/list', async (req, res) => {
    return await getReadingsController.handle(req,res);
});


export { router }