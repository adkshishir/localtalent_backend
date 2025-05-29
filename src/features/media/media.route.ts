// File: src/routes/media.route.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from './media.controller';

const mediaRouter = Router();

// Use memory storage to process file in memory
const upload = multer({ storage: multer.memoryStorage() });

mediaRouter.post('/upload', upload.single('image'), uploadImage);

export default mediaRouter;
