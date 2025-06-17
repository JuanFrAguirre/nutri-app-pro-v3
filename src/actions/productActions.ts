import prisma from '@/lib/prisma';
import { Product } from '@prisma/client';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
};
