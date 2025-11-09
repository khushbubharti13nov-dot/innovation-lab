import { Prisma } from '@prisma/client';
import prisma from '../../config/db.js';

export const getProducts = () => {
  return prisma.product.findMany();
};

export const createProduct = (
  data: Omit<Prisma.ProductCreateInput, 'sku'>
) => {
  // Generate a simple SKU, e.g., "APPLE-123"
  const sku = `${data.name.toUpperCase().substring(0, 5)}-${Math.floor(
    Math.random() * 1000
  )}`;

  return prisma.product.create({
    data: {
      ...data,
      sku,
    },
  });
};