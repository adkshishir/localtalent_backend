import { BookingStatus, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (data: any, user: User) => {
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      serviceId: data.serviceId,
      date: data.date,
      time: data.time,
      notes: data.notes,
      duration: data.duration,
    },
  });
  return booking;
};
export const updateBooking = async (id: number, data: any, user: User) => {
  const bookingExists = await prisma.booking.findUnique({
    where: { id, userId: user?.id },
  });
  if (!bookingExists) throw new Error('Booking not found');
  const booking = await prisma.booking.update({
    where: { id, userId: user?.id },
    data: {
      userId: data.userId,
      serviceId: data.serviceId,
      date: data.date,
      time: data.time,
      notes: data.notes,
    },
  });
  return booking;
};

export const updateBookingStatus = async (
  id: number,
  status: BookingStatus,
  user: User
) => {
  const bookingExists = await prisma.booking.findUnique({
    where: { id, service: { userId: user?.id } },
  });
  if (!bookingExists) throw new Error('Booking not found');
  const booking = await prisma.booking.update({
    where: { id, service: { userId: user?.id } },
    data: {
      status: status,
    },
  });
  return booking;
};

export const deleteBooking = async (id: number, user: User) => {
  const bookingExists = await prisma.booking.findUnique({
    where: { id, userId: user?.id },
  });
  if (!bookingExists) throw new Error('Booking not found');
  const booking = await prisma.booking.delete({
    where: { id, userId: user?.id },
  });
  return booking;
};

export const getBookings = async (user: User) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: user?.id },
    include: {
      service: true,
    },
  });
  return bookings;
};
export const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      service: true,
    },
  });
  return bookings;
};
export const bookingForFreelancer = async (user: User) => {
  const bookings = await prisma.booking.findMany({
    where: { service: { userId: user?.id } },
    include: {
      service: true,
    },
  });
  return bookings;
};
export const getBookingById = async (id: number, user: User) => {
  const booking = await prisma.booking.findUnique({
    where: { id, userId: user?.id },
    include: {
      service: true,
    },
  });
  return booking;
};
