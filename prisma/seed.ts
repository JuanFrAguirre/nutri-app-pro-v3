import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.food.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const hashedPassword = await bcrypt.hash('ASDasd123?', 10);
  await prisma.user.create({
    data: {
      id: '8c30a36b-6f8d-4ec6-9057-564ee9a4bdba',
      email: 'asd@asd',
      firstName: 'Test',
      lastName: 'User',
      password: hashedPassword,
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
