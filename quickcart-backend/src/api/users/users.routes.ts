import { Router } from 'express';
import * as userController from './users.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { isAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// POST /api/v1/users/create
// This route is protected:
// 1. You must be logged in (protect)
// 2. You must be an admin (isAdmin)
router.post('/create', protect, isAdmin, userController.createNewUser);

export default router;