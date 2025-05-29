// middleware/role-checker.ts
import { Request, Response, NextFunction } from 'express';
import { forbiddenHandler } from './error-handler';

// Extend the Request interface to include the `user` property
declare global {
  namespace Express {
    interface Request {
      user?: { role: string };
    }
  }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user || !allowedRoles.includes(user.role)) {
      forbiddenHandler(req, res, next);
    }
    next();
  };
};
