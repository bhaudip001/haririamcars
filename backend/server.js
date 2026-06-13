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
import morgan from 'morgan';
import connectDB from './config/db.js';
import { sanitizeInputs } from './middleware/validate.js';

// ── Environment Validation ──
const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredEnvs.forEach((envName) => {
  if (!process.env[envName]) {
    console.error(`❌ CRITICAL: ${envName} is missing in environment variables.`);
    // Instead of crashing the serverless function immediately (which breaks CORS),
    // we log the error. Individual routes will fail gracefully later.
  }
});

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

// ── Initialize Express ──
const app = express();
app.set('trust proxy', 1);

// ── Connect to MongoDB on every request (Serverless Pattern) ──
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ error: 'Database connection failed. Please check your configuration.' });
  }
});

// ── Global Middleware ──
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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
app.use(sanitizeInputs);

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://harirammotors.com',
  'https://www.harirammotors.com',
  'https://hariramcars.com',
  'https://www.hariramcars.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin)
      if (!origin) return callback(null, true);
      
      // Allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow any Vercel deployment dynamically
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      console.warn(`CORS blocked request from: ${origin}`);
      return callback(new Error(`CORS blocked: ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
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
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong on our end. Please try again later.'
      : err.message,
  });
});

// ── Start Server (Only if not in Vercel Serverless environment) ──
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚗 Hariram Motors API running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // ── Graceful Shutdown ──
  const gracefulShutdown = () => {
    console.log('Received kill signal, shutting down gracefully...');
    server.close(() => {
      console.log('Closed out remaining connections.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

// ── Export for Vercel Serverless ──
export default app;
