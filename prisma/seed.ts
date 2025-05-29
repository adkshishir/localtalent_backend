// File: prisma/seed.ts
import {
  PrismaClient,
  Role,
  ApprovalStatus,
  BookingStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];
  for (let i = 0; i < 100; i++) {
    const role: Role =
      i % 3 === 0 ? 'FREELANCER' : i % 5 === 0 ? 'ADMIN' : 'USER';
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
        role,
      },
    });
    users.push(user);
  }

  const freelancers = users.filter((u) => u.role === 'FREELANCER');
  const nonFreelancers = users.filter((u) => u.role === 'USER');

  // Create services
  const services: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    rate: number;
    category: string | null;
    availability: string;
    imageUrl: string | null;
    approved: ApprovalStatus;
    userId: number;
  }[] = [];
  for (let i = 0; i < 100; i++) {
    const freelancer = faker.helpers.arrayElement(freelancers);
    const service = await prisma.service.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        rate: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
        category: faker.commerce.department(),
        availability: '9AM - 5PM',
        imageUrl: faker.image.urlLoremFlickr({ category: 'people' }),
        approved: faker.helpers.arrayElement([
          'APPROVED',
          'PENDING',
          'REJECTED',
        ]),
        userId: freelancer.id,
      },
    });
    services.push(service);
  }

  // Create bookings
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(nonFreelancers);
    const service = faker.helpers.arrayElement(services);

    await prisma.booking.create({
      data: {
        date: faker.date.future().toISOString().split('T')[0],
        time: faker.helpers.arrayElement(['10:00', '14:00', '18:00']),
        notes: faker.lorem.sentence(),
        duration: faker.number.int({ min: 1, max: 3 }),
        userId: user.id,
        serviceId: service.id,
        status: faker.helpers.arrayElement(Object.values(BookingStatus)),
      },
    });
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
