// File: src/controllers/media.controller.ts
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { successResponse } from '../../utils/response-handler';

const UPLOAD_PATH = path.join(__dirname, '../../../uploads');

export const uploadImage: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = `${uuidv4()}.webp`;
    const filePath = path.join(UPLOAD_PATH, fileName);

    // Resize and convert to WebP
    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .webp({ quality: 80 })
      .toFile(filePath);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

    successResponse(res, 'Image uploaded successfully', { fileUrl });
  } catch (error) {
    next(error);
  }
};
