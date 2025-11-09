import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
import productRoutes from './products/products.routes.js'; // <-- ADD THIS
import inventoryRoutes from './inventory/inventory.routes.js'; // <-- ADD THIS

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes); // <-- ADD THIS
router.use('/inventory', inventoryRoutes); // <-- ADD THIS

export default router;