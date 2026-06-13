import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Simple in-memory set for token blacklisting (replace with Redis in production)
const tokenBlacklist = new Set();

export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  // Clean up expired tokens every hour
  setTimeout(() => tokenBlacklist.delete(token), 7 * 24 * 60 * 60 * 1000);
};

export const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

// Protect routes — verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been invalidated. Please login again.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'hariram-motors',
      audience: 'hariram-motors-admin',
    });
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.warn('⚠️ Auth failure:', {
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// Admin only access
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign(
    {
      id,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'hariram-motors',
      audience: 'hariram-motors-admin',
    }
  );
};
