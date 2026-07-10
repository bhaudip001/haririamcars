import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (upload buffer to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB
    files: 25,                    // max 25 files per request
    fieldSize: 1024 * 1024,       // 1MB for text fields
  },
  fileFilter: (_req, file, cb) => {
    // Check MIME type
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error('Only JPEG, PNG, WebP and AVIF images allowed'),
        false
      );
    }

    // Check file extension matches MIME
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file extension'), false);
    }

    cb(null, true);
  },
});

// Upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, folder = 'hariram-motors') => {
  // Verify it's actually an image by checking magic bytes
  const magic = buffer.slice(0, 8);
  const isJpeg = magic[0] === 0xFF && magic[1] === 0xD8;
  const isPng = magic[0] === 0x89 && magic[1] === 0x50;
  const isWebP = magic.toString('ascii', 0, 4) === 'RIFF';

  if (!isJpeg && !isPng && !isWebP) {
    throw new Error('Invalid image file');
  }

  // Generate unique public ID to prevent path traversal
  const uniqueId = crypto.randomBytes(16).toString('hex');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uniqueId,
        resource_type: 'image',
        transformation: [
          { width: 1920, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
          { strip_exif: true },  // Remove EXIF data (privacy)
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        max_bytes: 10 * 1024 * 1024,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

export { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };
