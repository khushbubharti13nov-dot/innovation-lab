import { Router } from 'express';
import * as productController from './products.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { isAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// All product routes are admin-only
router.use(protect, isAdmin);

// GET /api/v1/products
router.get('/', productController.handleGetProducts);
// POST /api/v1/products
router.post('/', productController.handleCreateProduct);

export default router;