import prisma from '../../config/db.js';

// Get all inventory, and include the product's name
export const getInventory = () => {
  return prisma.inventory.findMany({
    include: {
      product: {
        select: { name: true, sku: true },
      },
      darkStore: {
        select: { name: true },
      },
    },
    orderBy: { product: { name: 'asc' } },
  });
};

// Add a new product to a store's inventory
export const createInventoryItem = async (data: {
  productId: string;
  darkStoreId: string;
  quantity: number;
}) => {
  // Check if it already exists
  const existing = await prisma.inventory.findFirst({
    where: {
      productId: data.productId,
      darkStoreId: data.darkStoreId,
    },
  });

  if (existing) {
    throw new Error('This product is already in this store. Please update it instead.');
  }

  return prisma.inventory.create({
    data: {
      productId: data.productId,
      darkStoreId: data.darkStoreId,
      quantity: data.quantity,
    },
  });
};

// Update the quantity of an existing inventory item
export const updateInventoryQuantity = (
  id: string,
  quantity: number
) => {
  return prisma.inventory.update({
    where: { id },
    data: { quantity },
  });
};