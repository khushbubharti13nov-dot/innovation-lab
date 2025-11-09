import type { Request, Response } from 'express';
import * as inventoryService from './inventory.service.js';

export const handleGetInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await inventoryService.getInventory();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

export const handleCreateInventory = async (req: Request, res: Response) => {
  try {
    // You can add validation here to check req.body
    const item = await inventoryService.createInventoryItem(req.body);
    res.status(201).json(item);
  } catch (error: unknown) {
    let message = 'Error creating inventory item';
    if (error instanceof Error) message = error.message;
    res.status(400).json({ message });
  }
};

export const handleUpdateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // --- FIX 1: Check for missing ID ---
    if (!id) {
      return res.status(400).json({ message: 'Inventory item ID is required' });
    }

    // --- FIX 2: Check for missing or invalid quantity ---
    if (typeof quantity !== 'number' || quantity < 0) {
      return res
        .status(400)
        .json({ message: 'A valid quantity (number) is required' });
    }

    // Now TypeScript knows 'id' is a string and 'quantity' is a number
    const item = await inventoryService.updateInventoryQuantity(id, quantity);
    res.status(200).json(item);
  } catch (error: unknown) { // --- FIX 3: Catch as 'unknown' ---
    let message = 'Error updating inventory';
    if (error instanceof Error) message = error.message;
    res.status(400).json({ message });
  }
};