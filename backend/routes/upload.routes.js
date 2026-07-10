import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { cloudinary } from '../config/cloudinary.js';

const router = express.Router();

router.get('/signature', protect, adminOnly, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { 
        timestamp, 
        folder: 'hariram-motors/cars',
        transformation: 'w_1920,c_limit,q_auto:best,f_webp'
      },
      process.env.CLOUDINARY_API_SECRET
    );
    
    res.json({ 
      signature, 
      timestamp, 
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
