import { Router } from 'express';
import multer from 'multer';
import { StorageController } from '../controllers/storage.controller.js';

const router = Router();

// Store file in memory buffer for Sharp processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit before compression
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, HEIC) are allowed.'));
    }
  },
});

router.post('/upload', upload.single('image'), StorageController.uploadImage);

export default router;
