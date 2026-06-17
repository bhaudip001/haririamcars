import express from 'express';
import Brand from '../models/Brand.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/brands
// @desc    Get all brands
// @access  Public
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/brands
// @desc    Create a brand
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, models } = req.body;
    
    // Parse models if it's a comma-separated string
    let parsedModels = [];
    if (typeof models === 'string') {
      parsedModels = models.split(',').map(m => m.trim()).filter(Boolean);
    } else if (Array.isArray(models)) {
      parsedModels = models.map(m => m.trim()).filter(Boolean);
    }

    const brand = await Brand.create({
      name: name.trim(),
      models: parsedModels
    });
    
    res.status(201).json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Brand already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/brands/:id
// @desc    Update a brand
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, models } = req.body;
    
    let parsedModels = [];
    if (typeof models === 'string') {
      parsedModels = models.split(',').map(m => m.trim()).filter(Boolean);
    } else if (Array.isArray(models)) {
      parsedModels = models.map(m => m.trim()).filter(Boolean);
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: name ? name.trim() : undefined,
        models: parsedModels.length > 0 ? parsedModels : undefined
      },
      { new: true, runValidators: true }
    );

    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Brand name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/brands/:id
// @desc    Delete a brand
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
