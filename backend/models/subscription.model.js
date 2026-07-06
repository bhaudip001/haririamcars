import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate subscriptions for the same endpoint
  },
  expirationTime: {
    type: Date,
    default: null,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
