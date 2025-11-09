import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { isAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// All inventory routes are admin-only
router.use(protect, isAdmin);

// GET /api/v1/inventory
router.get('/', inventoryController.handleGetInventory);
// POST /api/v1/inventory
router.post('/', inventoryController.handleCreateInventory);
// PUT /api/v1/inventory/:id
router.put('/:id', inventoryController.handleUpdateInventory);

export default router;