import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({ success: false, message });
}
export function notFoundHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(404).json({ success: false, message: 'Not Found' });
}
export function methodNotAllowedHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
export function badRequestHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(400).json({ success: false, message: 'Bad Request' });
}
export function unauthorizedHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(401).json({ success: false, message: 'Unauthorized' });
}
export function forbiddenHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(403).json({ success: false, message: 'Forbidden' });
}
export function internalServerErrorHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
}
export function tooManyRequestsHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(429).json({ success: false, message: 'Too Many Requests' });
}
export function badGatewayHandler(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(502).json({ success: false, message: 'Bad Gateway' });
}
