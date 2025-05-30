import express from 'express';
import { config } from './config';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import authRouter from './features/auth/auth.route';
import serviceRouter from './features/service/service.router';
import bookingRouter from './features/booking/booking.router';
import mediaRouter from './features/media/media.route';
import path from 'path';

dotenv.config();

const app = express();
app.use(cookieParser()); // Middleware to parse cookies

// Security & parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(
  cors({
    origin: config.NODE_ENV === 'production' ? config.fontendUrl : true,
    credentials: true,
  })
);
// Create HTTP server
const server = http.createServer(app);

// Routes
app.use('/api', authRouter);
app.use('/api', serviceRouter);
app.use('/api', bookingRouter);
app.use('/api', mediaRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler (last)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀Server is running on http://localhost:${config.port}`);
});

// Graceful shutdown handler
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
};

// Listen for termination signals
process.on('SIGINT', shutdown); // Ctrl+C
process.on('SIGTERM', shutdown); // kill command or container stop
