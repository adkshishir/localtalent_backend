import {
  PrismaClient,
  Role,
  ApprovalStatus,
  BookingStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Step 1: Clear existing data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Step 2: Create predefined users
  const passwordHash = await bcrypt.hash('Password@123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        password: passwordHash,
        role: 'USER',
      },
      {
        name: 'Demo Freelancer',
        email: 'freelancer@demo.com',
        password: passwordHash,
        role: 'FREELANCER',
      },
      {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: passwordHash,
        role: 'ADMIN',
      },
    ],
  });

  const predefinedUsers = await prisma.user.findMany({
    where: {
      email: {
        in: ['user@demo.com', 'freelancer@demo.com', 'admin@demo.com'],
      },
    },
  });

  const users: typeof predefinedUsers = [...predefinedUsers];

  // Step 3: Generate 97 more users
  for (let i = 0; i < 97; i++) {
    const role: Role =
      i % 3 === 0 ? 'FREELANCER' : i % 5 === 0 ? 'ADMIN' : 'USER';
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        role,
      },
    });
    users.push(user);
  }

  const freelancers = users.filter((u) => u.role === 'FREELANCER');
  const nonFreelancers = users.filter((u) => u.role === 'USER');
  const demoUser = users.find((u) => u.email === 'user@demo.com');
  const demoFreelancer = users.find((u) => u.email === 'freelancer@demo.com');

  // Step 4: Create services (some for demoFreelancer too)
  const services: Array<{
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
  }> = [];
  for (let i = 0; i < 100; i++) {
    const freelancer =
      i < 5 && demoFreelancer
        ? demoFreelancer
        : faker.helpers.arrayElement(freelancers);

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

  // Step 5: Create bookings
  for (let i = 0; i < 100; i++) {
    const user =
      i < 5 && demoUser ? demoUser : faker.helpers.arrayElement(nonFreelancers);
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
