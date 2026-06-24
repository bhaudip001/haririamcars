import express from 'express';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// @route   POST /api/analytics/track
// @desc    Track page view and unique visitor
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const today = new Date();
    // Normalize to midnight UTC for daily tracking
    today.setUTCHours(0, 0, 0, 0);

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

    let analytics = await Analytics.findOne({ date: today });
    if (!analytics) {
      analytics = new Analytics({ 
        date: today, 
        pageViews: 1, 
        visitors: 1, 
        ips: [ip] 
      });
    } else {
      if (!analytics.ips.includes(ip)) {
        analytics.pageViews += 1;
        analytics.visitors += 1;
        analytics.ips.push(ip);
      }
    }
    
    await analytics.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Analytics tracking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/summary
// @desc    Get traffic summary for the last 30 days
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const limitDays = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (limitDays - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    const data = await Analytics.find({ date: { $gte: startDate } }).sort({ date: 1 });
    
    // Fill missing days with 0s to ensure a continuous chart
    const result = [];
    
    for (let i = limitDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      
      const record = data.find(r => r.date.getTime() === d.getTime());
      
      // Format as "12 Aug" for better readability on 30-day graphs
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${d.getDate()} ${monthNames[d.getMonth()]}`;

      result.push({
        name: formattedDate,
        pageViews: record ? record.pageViews : 0,
        visitors: record ? record.visitors : 0,
        fullDate: d
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
