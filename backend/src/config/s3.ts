import { S3Client } from '@aws-sdk/client-s3';
import { config } from './index';

export const s3Client = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  endpoint: config.s3.endpoint,
  forcePathStyle: Boolean(config.s3.endpoint), // Required for MinIO / local S3
});
