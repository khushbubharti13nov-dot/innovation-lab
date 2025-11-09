import { Router } from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js'; // <-- IMPORT protect

const router = Router();

// --- Public routes ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- !! NEW ROUTE TO ADD !! ---
// This route is protected by our 'protect' middleware
router.get('/profile', protect, authController.getMyProfile);

export default router;