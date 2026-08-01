import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../config/imgbb.js';
import axios from 'axios';
import FormData from 'form-data';
import heicConvert from 'heic-convert';

const router = express.Router();

router.get('/signature', protect, adminOnly, (req, res) => {
  try {
    res.json({ 
      api_key: process.env.IMGBB_API_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route for handling HEIC conversion on the backend for iPhones
router.post('/heic-to-imgbb', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let imageBuffer = req.file.buffer;

    // Convert HEIC to JPG using backend WASM
    const outputBuffer = await heicConvert({
      buffer: imageBuffer,
      format: 'JPEG',
      quality: 0.95
    });

    // Upload the converted JPG to ImgBB
    const formData = new FormData();
    formData.append('image', outputBuffer, { filename: req.file.originalname.replace(/\.heic$|\.heif$/i, '.jpg'), contentType: 'image/jpeg' });

    const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
      headers: formData.getHeaders()
    });

    if (imgbbRes.data && imgbbRes.data.success) {
      res.json({ success: true, data: { url: imgbbRes.data.data.url, id: imgbbRes.data.data.id } });
    } else {
      res.status(500).json({ success: false, message: 'ImgBB upload failed after conversion' });
    }

  } catch (error) {
    console.error('HEIC Backend Conversion Error:', error);
    res.status(500).json({ success: false, message: 'Failed to convert HEIC image: ' + error.message });
  }
});

import multer from 'multer';
import sharp from 'sharp';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy'
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const uploadMem = multer({ storage });

// New route for ImageKit with Sharp compression
router.post('/imagekit', protect, adminOnly, uploadMem.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // Forcefully resize and compress to WebP using sharp (~80KB target)
    const webpBuffer = await sharp(req.file.buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    // Upload the compressed buffer directly to ImageKit
    const response = await imagekit.upload({
      file: webpBuffer,
      fileName: `car-${Date.now()}.webp`,
      folder: '/inventory'
    });

    res.json({ 
      success: true, 
      url: response.url, 
      publicId: response.fileId 
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
