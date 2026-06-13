// ═══════════════════════════════════════════════════════
//  Hariram Motors — Express API Entry Point
// ═══════════════════════════════════════════════════════

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connectDB from './config/db.js';

// ── Custom Mongo Sanitizer ──
function sanitizeObject(obj) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}
function mongoSanitize() {
  return (req, _res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    next();
  };
}

// Route imports
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import sellRequestRoutes from './routes/sellRequest.routes.js';
import messageRoutes from './routes/message.routes.js';
import happyCustomerRoutes from './routes/happyCustomer.routes.js';
import promoBannerRoutes from './routes/promoBanner.routes.js';
import siteSettingRoutes from './routes/siteSetting.routes.js';

// ── Connect to MongoDB ──
connectDB();

// ── Initialize Express ──
const app = express();
app.set('trust proxy', 1);

// ── Global Middleware ──
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://res.cloudinary.com',
          'https://images.unsplash.com',
          'https://lh3.googleusercontent.com',
        ],
        connectSrc: [
          "'self'",
          process.env.FRONTEND_URL,
          'https://api.cloudinary.com',
        ],
        frameSrc: [
          "'self'",
          'https://www.google.com',
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// CORS
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        'https://haririamcars.vercel.app',
        'https://harirammotors.com',
        'https://www.harirammotors.com',
      ].filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS blocked: ${origin} not allowed`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400, // Cache preflight for 24h
  })
);

// Rate limiting
// General API: 200 req / 15 min
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
  skip: (req) => req.method === 'GET'
    && req.path.startsWith('/api/cars'),
});

// Auth: 10 attempts / 15 min (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

// Contact/Sell forms: 5 submissions / hour
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Try again in an hour.' },
});

// File upload: 20 uploads / hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Upload limit reached. Try again later.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/messages', formLimiter);
app.use('/api/sell-requests', uploadLimiter);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Hariram Motors API is running' });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/sell-requests', sellRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/happy-customers', happyCustomerRoutes);
app.use('/api/promo-banners', promoBannerRoutes);
app.use('/api/site-settings', siteSettingRoutes);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Hariram Motors API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
