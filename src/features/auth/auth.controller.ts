import { Request, Response, NextFunction } from 'express';
import * as AuthService from './auth.service';
import { asyncHandler } from '../../utils/async-handler';
import { errorResponse, successResponse } from '../../utils/response-handler';
import { config } from '../../config';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const user = await AuthService.register(data);
  successResponse(res, 'User registered successfully', user, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.cookie('refresh-token', result.tokens.refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'strict', // Adjust as needed
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  successResponse(res, 'Login successful', {
    user: result.user,
    tokens: {
      accessToken: result.tokens.accessToken,
    },
  });
});

export const getAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      errorResponse(res, 'Refresh token is required', {}, 400);
      return;
    } else {
      const data = await AuthService.getAccessToken(refreshToken || '');
      successResponse(res, 'User Verify Successfully', data);
      return;
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      errorResponse(res, 'Email is required', {}, 400);
    }
    await AuthService.forgotPassword(email);
    successResponse(res, 'Password reset email sent successfully', {});
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    const email = res.locals.user.email; // Assuming email is stored in response locals
    if (!email) {
      errorResponse(res, 'Email is required', {}, 400);
    }
    await AuthService.resetPassword(email, newPassword);
    successResponse(res, 'Password reset successfully', {});
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      errorResponse(res, 'Old and new passwords are required', {}, 400);
    }
    const userId = res.locals.user.id; // Assuming user ID is stored in response locals
    const updatedUser = await AuthService.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    successResponse(res, 'Password changed successfully', updatedUser);
  }
);
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id; // Assuming user ID is stored in response locals
    const userProfile = await AuthService.getUserById(userId);
    successResponse(res, 'User profile retrieved successfully', userProfile);
  }
);
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id; // Assuming user ID is stored in response locals
    const data = req.body; // this will throw on invalid input
    const updatedProfile = await AuthService.updateUser(userId, data);
    successResponse(res, 'User profile updated successfully', updatedProfile);
  }
);
export const deleteUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id; // Assuming user ID is stored in response locals
    await AuthService.deleteUser(userId);
    successResponse(res, 'User profile deleted successfully', {});
  }
);
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await AuthService.getAllUsers();
  successResponse(res, 'All users retrieved successfully', users);
});
export const deleteByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const deletedUser = await AuthService.deleteUser(userId);
    successResponse(res, 'User deleted successfully', deletedUser);
  }
);

export const initAdmin = asyncHandler(async (req: Request, res: Response) => {
  const initedAdmin = await AuthService.initAdmin();
  if (initAdmin) {
    successResponse(res, 'Admin initialized successfully', initAdmin);
  } else {
    errorResponse(res, 'Admin already exists', {}, 400);
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('refresh-token', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'strict', // Adjust as needed
  });
  successResponse(res, 'Logout successful', {});
});
