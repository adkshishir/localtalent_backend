import { body, param } from 'express-validator';

export const createServiceValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('rate').isFloat({ gt: 0 }).withMessage('Rate must be a positive number'),
  body('availability').notEmpty().withMessage('Availability is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

export const updateServiceValidator = [
  param('id').isInt().withMessage('Service ID must be an integer'),
  body('title').optional().isString(),
  body('rate').optional().isFloat({ gt: 0 }),
  body('description').optional().isString(),
  body('availability').optional().isString(),
  body('category').optional().isString(),
];

export const updateStatusValidator = [
  param('id').isInt().withMessage('Service ID must be an integer'),
  body('status')
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be either active or inactive'),
];
