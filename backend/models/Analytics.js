import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true, 
    unique: true 
  },
  pageViews: { 
    type: Number, 
    default: 0 
  },
  visitors: { 
    type: Number, 
    default: 0 
  },
  appInstalls: {
    type: Number,
    default: 0
  },
  ips: [{ 
    type: String 
  }]
}, { 
  timestamps: true 
});

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
