import type { Request, Response } from 'express';
import * as productService from './products.service.js';

export const handleGetProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const handleCreateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
};