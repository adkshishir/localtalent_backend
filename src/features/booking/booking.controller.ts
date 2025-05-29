import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import {
  bookingForFreelancer,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getBookings,
  updateBooking,
  updateBookingStatus,
} from './booking.service';

export const create = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = res.locals?.user;
  const booking = await createBooking(data, user);
  successResponse(res, 'Booking created successfully', booking, 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const booking = await updateBookingStatus(id, data.status, res.locals?.user);
  successResponse(res, 'Booking updated successfully', booking);
});

export const findAll = asyncHandler(async (req, res) => {
  const bookings = await getAllBookings();
  successResponse(res, 'Bookings retrieved successfully', bookings);
});
export const userBookings = asyncHandler(async (req, res) => {
  const bookings = await getBookings(res.locals.user);
  successResponse(res, 'Bookings retrieved successfully', bookings);
});
export const findOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const booking = await getBookingById(id, res.locals.user);
  successResponse(res, 'Booking retrieved successfully', booking);
});

export const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const booking = await deleteBooking(id, res.locals.user);
  successResponse(res, 'Booking deleted successfully', booking);
});

export const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const booking = await updateBooking(id, data, res.locals.user);
  successResponse(res, 'Booking updated successfully', booking);
});

export const bookingFreelancer = asyncHandler(async (req, res) => {
  const bookings = await bookingForFreelancer(res.locals?.user);
  successResponse(
    res,
    'Bookings for freelancer retrieved successfully',
    bookings
  );
});
