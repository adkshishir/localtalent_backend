import { Response } from 'express';

export function successResponse<T>(
  res: Response,
  message: string,
  data: T,
  code: number = 200
) {
  return res.status(code).json({
    status: 'success',
    message: message || 'Operation successful',
    data: data || {},
  });
}
export function errorResponse<T = any>(
  res: Response,
  message: string,
  data?: T,
  code: number = 500
) {
  return res.status(code).json({
    status: 'error',
    message: message || 'An error occurred',
    error: data || {},
  });
}
