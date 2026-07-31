import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

// Multer memory storage (upload buffer to ImgBB)
const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024,  // 32MB ImgBB limit
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
      'image/gif'
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error('Only JPEG, PNG, GIF, WebP and AVIF images allowed'),
        false
      );
    }

    cb(null, true);
  },
});

// Upload buffer to ImgBB
const uploadToImgBB = async (buffer) => {
  // Convert buffer to base64
  const base64Image = buffer.toString('base64');
  
  const formData = new FormData();
  formData.append('image', base64Image);
  
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY is missing');
  }

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
      headers: formData.getHeaders()
    });

    const data = response.data.data;
    
    // Return in a format compatible with our existing code
    return {
      public_id: data.id, 
      secure_url: data.url, 
      thumbnail_url: data.thumb ? data.thumb.url : data.url,
      delete_url: data.delete_url
    };
  } catch (error) {
    console.error('ImgBB upload error:', error?.response?.data || error.message);
    throw new Error('Image upload failed');
  }
};

// Delete image from ImgBB
const deleteFromImgBB = async (publicId) => {
  // ImgBB does not provide a straightforward API deletion endpoint using just the API key.
  // Since storage is 100% unlimited and free, we can safely ignore programmatic deletion.
  // This prevents the application from crashing when trying to delete old Cloudinary/ImgBB images.
  console.log(`[ImgBB] Skipped deletion for ID: ${publicId} (Unlimited Free Storage)`);
  return true;
};

export { upload, uploadToImgBB, deleteFromImgBB };
