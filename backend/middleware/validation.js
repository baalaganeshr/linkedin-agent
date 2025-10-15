// Input validation middleware for LinkedInScholar
const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Validate request and throw error if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join('. ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  validate,
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for resume generation
 */
const resumeGenerationValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('targetRole')
    .trim()
    .notEmpty()
    .withMessage('Target role is required'),
  body('country')
    .optional()
    .isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'global'])
    .withMessage('Invalid country code'),
  body('skills.technical')
    .optional()
    .isArray()
    .withMessage('Technical skills must be an array'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  validate,
];

/**
 * Validation rules for profile optimization
 */
const profileOptimizationValidation = [
  body('headline')
    .optional()
    .trim()
    .isLength({ max: 220 })
    .withMessage('Headline must be less than 220 characters'),
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 2600 })
    .withMessage('Summary must be less than 2600 characters'),
  body('targetRole')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Target role cannot be empty'),
  body('country')
    .optional()
    .isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'global'])
    .withMessage('Invalid country code'),
  validate,
];

/**
 * Validation rules for networking suggestions
 */
const networkingValidation = [
  body('targetRole')
    .trim()
    .notEmpty()
    .withMessage('Target role is required'),
  body('targetIndustry')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Target industry cannot be empty'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('country')
    .optional()
    .isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'global'])
    .withMessage('Invalid country code'),
  validate,
];

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potential script tags or malicious code
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  resumeGenerationValidation,
  profileOptimizationValidation,
  networkingValidation,
  sanitizeInput,
};
