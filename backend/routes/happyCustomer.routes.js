import express from 'express';
import HappyCustomer from '../models/HappyCustomer.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { cache, clearCache } from '../middleware/cache.js';

const router = express.Router();

// ── GET /api/happy-customers — Public listing ──
router.get('/', cache(15), async (_req, res) => {
  try {
    const customers = await HappyCustomer.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/happy-customers/all — Admin listing ──
router.get('/all', protect, adminOnly, async (_req, res) => {
  try {
    const customers = await HappyCustomer.find().sort({ createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/happy-customers — Create (admin) ──
router.post('/', protect, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'hariram-motors/happy-customers');
      data.photo = { url: result.secure_url, publicId: result.public_id };
    }

    const customer = await HappyCustomer.create(data);
    clearCache('/api/happy-customers');
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/happy-customers/:id — Update (admin) ──
router.put('/:id', protect, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    const customer = await HappyCustomer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });

    if (req.file) {
      // Delete old photo
      if (customer.photo?.publicId) await deleteFromCloudinary(customer.photo.publicId);
      const result = await uploadToCloudinary(req.file.buffer, 'hariram-motors/happy-customers');
      customer.photo = { url: result.secure_url, publicId: result.public_id };
    }

    if (req.body.customerName !== undefined) customer.customerName = req.body.customerName;
    if (req.body.review !== undefined) customer.review = req.body.review;
    if (req.body.rating !== undefined) customer.rating = req.body.rating;
    if (req.body.isActive !== undefined) customer.isActive = req.body.isActive;

    await customer.save();
    clearCache('/api/happy-customers');
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/happy-customers/:id ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const customer = await HappyCustomer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    if (customer.photo?.publicId) await deleteFromCloudinary(customer.photo.publicId);
    await HappyCustomer.findByIdAndDelete(req.params.id);
    clearCache('/api/happy-customers');
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
