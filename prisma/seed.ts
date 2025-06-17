import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SEED_PRODUCTS } from './seedData';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.mealProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const hashedPassword = await bcrypt.hash('ASDasd123?', 10);
  const user = await prisma.user.create({
    data: {
      id: '8c30a36b-6f8d-4ec6-9057-564ee9a4bdba',
      email: 'asd@asd',
      firstName: 'Test',
      lastName: 'User',
      password: hashedPassword,
    },
  });

  // Create sample products
  const products = await Promise.all(
    SEED_PRODUCTS.map((product) =>
      prisma.product.create({
        data: product,
      }),
    ),
  );

  // Create a sample meal for the user
  // const meal = await prisma.meal.create({
  //   data: {
  //     name: 'Healthy Lunch',
  //     userId: user.id,
  //     products: {
  //       create: [
  //         {
  //           quantity: 150,
  //           productId: products[0].id, // Chicken Breast
  //         },
  //         {
  //           quantity: 100,
  //           productId: products[1].id, // Brown Rice
  //         },
  //       ],
  //     },
  //   },
  // });

  console.log('Database has been seeded. 🌱');
  console.log('Created user:', { ...user, password: '[REDACTED]' });
  console.log('Created products:', products.length);
  // console.log('Created meal:', meal);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
