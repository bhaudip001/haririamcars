import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

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

export default router;
