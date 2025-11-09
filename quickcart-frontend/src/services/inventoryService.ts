import { isAxiosError } from 'axios';
import api from './api.js'; // <-- FIX: Added '.js'
import type { Product } from './productService.js'; // <-- FIX: Added 'import type' and '.js'

// Define the Inventory type
export interface InventoryItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    sku: string;
  };
  darkStore: {
    name: string | null;
  };
}

export const getInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) { // <-- FIX: Use type guard
    if (isAxiosError(error)) {
      console.error(
        'Failed to fetch inventory',
        error.response?.data?.message
      );
    } else {
      console.error('Failed to fetch inventory', error);
    }
    return [];
  }
};

export const updateInventoryQuantity = async (
  id: string,
  quantity: number
): Promise<InventoryItem> => {
  try {
    const response = await api.put(`/inventory/${id}`, { quantity });
    return response.data;
  } catch (error: unknown) { // <-- FIX: Catch as 'unknown'
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update quantity'
      );
    }
    throw new Error('An unexpected error occurred');
  }
};

// We'll add the "create" function later to keep this simple