import api from './api';

// Define the Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products', error);
    return [];
  }
};

export const createProduct = async (data: {
  name: string;
  price: number;
}): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data;
};