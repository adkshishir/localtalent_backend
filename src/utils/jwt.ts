import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateAccessToken = (userId: string | number) => {
  return jwt.sign({ userId }, config.jwtSecret!, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: string | number) => {
  return jwt.sign({ userId }, config.jwtSecret!, {});
};

export interface JwtPayload {
  userId: string;
  // email: string;
  // Add more fields if needed
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
