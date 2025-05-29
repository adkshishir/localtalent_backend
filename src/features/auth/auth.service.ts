import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { config } from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../utils/jwt';
import { sendForgotPasswordEmail } from '../mail/mail.service';
import { RegisterType } from './auth.type';
import { errorResponse } from '../../utils/response-handler';
const prisma = new PrismaClient();

export const register = async (data: RegisterType) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing)
    throw new Error(
      'User with this email already exists. Please use a different email.'
    );
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
    },
  });
  if (!user) throw new Error('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const getAccessToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken) as JwtPayload;

  if (!decoded || typeof decoded === 'string') {
    throw new Error('Invalid refresh token');
  }

  const userId = decoded.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    throw new Error('User not found for the provided refresh token');
    return;
  }
  const accessToken = generateAccessToken(userId);
  return { accessToken, user };
};
export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!user) throw new Error('User not found');
  return user;
};
export const updateUser = async (
  userId: number,
  data: Partial<RegisterType>
) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing && existing.id !== userId) {
    throw new Error(
      'User with this email already exists. Please use a different email.'
    );
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      password: data.password
        ? await bcrypt.hash(data.password, 10)
        : undefined,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return user;
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return user;
};
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return users;
};
export const changePassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) throw new Error('Old password is incorrect');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return updatedUser;
};
export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error('User not found');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { password: hashedNewPassword },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return updatedUser;
};
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error('User not found');
  const token = jwt.sign({ id: user.id }, config.jwtSecret!, {
    expiresIn: '1h',
  });
  await sendForgotPasswordEmail(email, token);
  return {
    message: 'Password reset link has been sent to your email',
    userId: user.id,
  };
};

export const initAdmin = async () => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: config.adminEmail || '' },
  });
  if (existingAdmin) {
    return;
  }
  const hashedPassword = await bcrypt.hash(config.adminPassword!, 10);
  const adminUser = await prisma.user.create({
    data: {
      name: config.adminName || 'Admin',
      email: config.adminEmail || '',
      password: hashedPassword,
      role: 'ADMIN',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return adminUser;
};
