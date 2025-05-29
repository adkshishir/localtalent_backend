import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  //   body('role') must not be admin
  body('role').custom((value) => {
    if (value && value.toUpperCase() === 'ADMIN') {
      throw new Error('Role cannot be ADMIN');
    }
    return true;
  }),
  // Add more validation rules as needed
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
export const changePasswordValidator = [
  body('oldPassword')
    .isLength({ min: 6 })
    .withMessage('Old password must be at least 6 characters'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];
export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  // Add more validation rules as needed
];
