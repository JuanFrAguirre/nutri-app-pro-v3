import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reset() {
  try {
    // Delete all existing data
    await prisma.mealProduct.deleteMany();
    await prisma.product.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.user.deleteMany();

    console.log('Database has been reset successfully. 🧹');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
