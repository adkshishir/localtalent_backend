import { Router } from 'express';
import {
  findAll,
  findOne,
  create,
  remove,
  update,
  updateStatus,
  userBookings,
  bookingFreelancer,
} from './booking.controller';
import { authenticate } from '../../middleware/auth';
import { authorizeRoles } from '../../middleware/role-checker';
import { validateRequest } from '../../middleware/validate';
import {
  createBookingValidator,
  updateBookingStatusValidator,
  updateBookingValidator,
} from './booking.validator';

const bookingRouter = Router();

bookingRouter.post(
  '/booking',
  authenticate,
  createBookingValidator,
  validateRequest,
  create
);
bookingRouter.get('/booking', authenticate, authorizeRoles('ADMIN'), findAll);
bookingRouter.get('/booking/user', authenticate, userBookings);
bookingRouter.get(
  '/booking/freelancer',
  authenticate,
  authorizeRoles('FREELANCER', 'ADMIN'),
  bookingFreelancer
);
bookingRouter.get('/booking/:id', authenticate, findOne);
bookingRouter.delete('/booking/:id', authenticate, remove);
bookingRouter.put(
  '/booking/:id',
  authenticate,
  updateBookingValidator,
  validateRequest,
  update
);

bookingRouter.put(
  '/booking/status/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FREELANCER'),
  updateBookingStatusValidator,
  validateRequest,
  updateStatus
);

export default bookingRouter;
