import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const val = process.env[key];
  if (!val && fallback === undefined) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return val || fallback!;
}

export const config = {
  port: getEnv('PORT', '3000'),
  jwtSecret: getEnv('JWT_SECRET'),
  dbUrl: getEnv('DATABASE_URL'),
  baseUrl: getEnv('BASE_URL', 'http://localhost:3000'),
  fontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
  mailHost: getEnv('MAIL_HOST', 'smtp.mailtrap.io'),
  mailPort: getEnv('MAIL_PORT', '587'),
  mailUser: getEnv('MAIL_USER', ''),
  mailPass: getEnv('MAIL_PASSWORD', ''),
  mailFrom: getEnv('MAIL_FROM', 'LocalTalent Support <d0CfM@example.com>'),
  adminEmail: getEnv('ADMIN_NAME', 'admin@admin.com'),
  adminPassword: getEnv('ADMIN_PASSWORD', 'admin123'),
  adminName: getEnv('ADMIN_NAME', 'Admin'),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
};
