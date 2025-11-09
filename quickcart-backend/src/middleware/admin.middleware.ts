import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';
import prisma from '../config/db.js';

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // This middleware MUST run AFTER the 'protect' middleware
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (user && user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};