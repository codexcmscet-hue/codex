import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';
import { s3Client } from '../config/s3';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class UploadService {
  async getPresignedUploadUrl(params: {
    filename: string;
    contentType: string;
    fileSize?: number;
    folder?: string;
  }) {
    if (!ALLOWED_MIME_TYPES.includes(params.contentType)) {
      throw new AppError(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`, 400);
    }

    if (params.fileSize && params.fileSize > MAX_FILE_SIZE) {
      throw new AppError(`File size exceeds 5MB limit`, 400);
    }

    const ext = path.extname(params.filename) || '.jpg';
    const safeKey = `${params.folder || 'general'}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    const command = new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: safeKey,
      ContentType: params.contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 mins

    const publicUrl = config.s3.endpoint
      ? `${config.s3.endpoint}/${config.s3.bucket}/${safeKey}`
      : `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${safeKey}`;

    return {
      presignedUrl,
      objectKey: safeKey,
      publicUrl,
      expiresIn: 300,
    };
  }

  async deleteFile(objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: config.s3.bucket,
      Key: objectKey,
    });
    await s3Client.send(command);
  }
}

export const uploadService = new UploadService();

