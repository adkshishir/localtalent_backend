import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format'),

  body('time').notEmpty().withMessage('Time is required').isString(),

  body('notes').optional().isString(),

  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .isInt()
    .withMessage('Service ID must be an integer'),
];
export const updateBookingValidator = [
  param('id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isInt()
    .withMessage('Booking ID must be an integer'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format'),

  body('time').optional().isString(),

  body('notes').optional().isString(),

  body('serviceId')
    .optional()
    .isInt()
    .withMessage('Service ID must be an integer'),
];

export const updateBookingStatusValidator = [
  param('id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isInt()
    .withMessage('Booking ID must be an integer'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([
      'PENDING',
      'ACCEPTED',
      'REJECTED',
      'COMPLETED',
      'IN_PROGRESS',
      'FAILED',
      'REFUNDED',
      'ON_HOLD',
    ])
    .withMessage('Invalid booking status'),
];
