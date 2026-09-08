import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { ApiResponse } from '@codexclub/shared';

export class UploadController {
  async getPresignedUrl(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { filename, contentType, fileSize, folder } = req.body;
      const result = await uploadService.getPresignedUploadUrl({
        filename,
        contentType,
        fileSize,
        folder,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteFile(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      await uploadService.deleteFile(req.body.objectKey);
      res.json({
        success: true,
        message: 'File deleted from storage',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const uploadController = new UploadController();

