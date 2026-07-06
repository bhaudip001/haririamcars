import express from 'express';
import { Subscription } from '../models/subscription.model.js';

const router = express.Router();

// ── POST /api/notifications/subscribe — Save Push Subscription ──
router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    
    // Check if subscription already exists by endpoint
    let existingSub = await Subscription.findOne({ endpoint: subscription.endpoint });
    
    if (existingSub) {
      // Update existing subscription
      existingSub.expirationTime = subscription.expirationTime;
      existingSub.keys = subscription.keys;
      await existingSub.save();
    } else {
      // Create new subscription
      await Subscription.create(subscription);
    }
    
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

export default router;
