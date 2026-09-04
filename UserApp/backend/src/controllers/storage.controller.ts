import { Request, Response } from 'express';
import { StorageService, StorageBucket } from '../services/storage.service.js';

export class StorageController {
  static async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No image file provided in request.' });
        return;
      }

      const validBuckets: StorageBucket[] = ['avatars', 'products', 'land_records', 'pod'];
      let bucket: StorageBucket = (req.body.bucket as StorageBucket) || 'products';
      if (!validBuckets.includes(bucket)) {
        bucket = 'products';
      }

      const result = await StorageService.uploadCompressedImage(
        file.buffer,
        file.originalname || 'upload',
        bucket
      );

      res.status(200).json({
        success: true,
        message: `Image compressed and uploaded successfully. Space saved: ${result.savingsPercent}%`,
        data: result,
      });
    } catch (err: any) {
      console.error('[StorageController] Upload error:', err);
      res.status(500).json({
        error: 'Failed to compress and upload image',
        details: err?.message,
      });
    }
  }
}
