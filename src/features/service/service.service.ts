import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
export const createService = async (data: any, user: User) => {
  const service = await prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      rate: data.rate,
      availability: data.availability,
      imageUrl: data.imageUrl,
      approved: 'PENDING', // Default status for new services
      userId: user.id, // Assuming userId is passed in the data
      category: data.category,
    },
  });
  return service;
};
export const updateService = async (id: number, data: any, user: User) => {
  const serviceExists = await prisma.service.findUnique({
    where: { id, userId: user?.role! == 'ADMIN' ? user.id : undefined },
  });
  if (!serviceExists) throw new Error('Service not found');
  const service = await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      rate: data.rate,
      description: data.description,
      availability: data.availability,
      category: data.category,
    },
  });
  return service;
};

export const getById = async (id: number) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });
  return service;
};
export const getAll = async (user?: User) => {
  const role = user?.role;
  const userId = role !== 'USER' ? user?.id : undefined;
  const services = await prisma.service.findMany({
    where: {
      userId: role !== 'ADMIN' ? user?.id : undefined,
      approved: userId ? undefined : 'APPROVED',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return services;
};
export const updateStatus = async (
  id: number,
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
) => {
  const serviceExists = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      approved: true,
    },
  });
  if (!serviceExists) throw new Error('Service not found');
  const service = await prisma.service.update({
    where: { id },
    data: {
      approved: status,
    },
  });
  return service;
};

export const deleteService = async (id: number, user: User) => {
  const serviceExists = await prisma.service.findUnique({
    where: { id, userId: user?.role! == 'ADMIN' ? user.id : undefined },
  });
  if (!serviceExists) throw new Error('Service not found');
  const service = await prisma.service.delete({
    where: {
      id,
    },
  });
  return service;
};
export const getByUserId = async (userId: number) => {
  const services = await prisma.service.findMany({
    where: { userId },
  });
  return services;
};
