import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  getAccessToken,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  initAdmin,
  logout,
  deleteByAdmin,
} from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
} from './auth.validator';
import { authenticate } from '../../middleware/auth';
import { authorizeRoles } from '../../middleware/role-checker';

const authRouter = Router();

authRouter.post('/auth/register', registerValidator, validateRequest, register);
authRouter.post('/auth/login', loginValidator, validateRequest, login);
authRouter.post(
  '/auth/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  forgotPassword
);
authRouter.post(
  '/auth/reset-password',
  authenticate,
  resetPasswordValidator,
  validateRequest,
  resetPassword
);
authRouter.post('/auth/refresh', getAccessToken);
authRouter.get(
  '/auth/get-all-users',
  authenticate,
  authorizeRoles('ADMIN'),
  getAllUsers
);
authRouter.get('/auth/get-user-profile', authenticate, getUserProfile);
authRouter.put(
  '/auth/update-user-profile',
  authenticate,
  updateProfileValidator,
  validateRequest,
  updateUserProfile
);
authRouter.delete('/auth/delete-user-profile', authenticate, deleteUserProfile);
authRouter.delete(
  '/auth/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  deleteByAdmin
);
authRouter.post('/auth/init-admin', initAdmin);
authRouter.post('/auth/logout', logout);

export default authRouter;
