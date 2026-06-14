import { body, validationResult } from 'express-validator';
import xss from 'xss';

// Middleware to check validation results
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// XSS sanitizer middleware
export const sanitizeInputs = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key].trim());
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) req.body = sanitize(req.body);
  next();
};

// Validation rules for each route:

export const validateLogin = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be 6-100 characters'),
  handleValidation,
];

export const validateCar = [
  body('make')
    .trim().notEmpty().isLength({ max: 50 })
    .withMessage('Brand required, max 50 chars'),
  body('model')
    .trim().notEmpty().isLength({ max: 50 })
    .withMessage('Model required, max 50 chars'),
  body('year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year required'),
  body('price')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 100000000 })
    .withMessage('Valid price required'),
  body('kms')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 1000000 })
    .withMessage('Valid KM required'),
  body('fuelType')
    .optional({ checkFalsy: true })
    .isIn(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .optional({ checkFalsy: true })
    .isIn(['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'])
    .withMessage('Invalid transmission'),
  handleValidation,
];

export const validateMessage = [
  body('name')
    .trim().notEmpty().isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 chars'),
  body('phone')
    .trim().notEmpty()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit Indian phone required'),
  body('email')
    .optional({ checkFalsy: true }).isEmail().normalizeEmail()
    .withMessage('Valid email required'),
  body('message')
    .trim().notEmpty().isLength({ min: 10, max: 2000 })
    .withMessage('Message must be 10-2000 chars'),
  handleValidation,
];

export const validateSellRequest = [
  body('ownerName')
    .trim().notEmpty().isLength({ min: 2, max: 100 })
    .withMessage('Name required'),
  body('phone')
    .trim().notEmpty()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid Indian phone required'),
  body('carBrand')
    .trim().notEmpty().isLength({ max: 50 })
    .withMessage('Car brand required'),
  body('carModel')
    .trim().notEmpty().isLength({ max: 50 })
    .withMessage('Car model required'),
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year required'),
  body('expectedPrice')
    .optional()
    .isFloat({ min: 0, max: 100000000 })
    .withMessage('Valid price required'),
  handleValidation,
];
