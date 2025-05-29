import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response-handler';
import { PrismaClient } from '@prisma/client';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const prisma = new PrismaClient();
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Authorization header is required', {}, 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) || undefined },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      errorResponse(res, 'Your Token is not valid', {}, 401);
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    errorResponse(res, 'Unauthorized access', {}, 401);
    return;
  }
};
