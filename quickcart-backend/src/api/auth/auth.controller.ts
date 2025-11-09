import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import prisma from '../../config/db.js'; // <-- IMPORT PRISMA
import type { AuthRequest } from '../../middleware/auth.middleware.js'; // <-- IMPORT AuthRequest

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await authService.registerUser(req.body);
    res.status(201).json({ token });
  } catch (error: unknown) { // <-- FIX: Use 'unknown' instead of 'any'
    // Basic error handling
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({ message });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await authService.loginUser(req.body);
    res.status(200).json({ token });
  } catch (error: unknown) { // <-- FIX: Use 'unknown' instead of 'any'
    // Basic error handling
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(401).json({ message });
  }
};

// --- !! NEW FUNCTION WITH DEBUG LOGS !! ---
export const getMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // --- DEBUG LOG ---
  console.log('--- GETMYPROFILE CONTROLLER CALLED ---');
  try {
    if (!req.user) {
      // --- DEBUG LOG ---
      console.log('GETMYPROFILE FAILED: req.user is missing');
      return res.status(401).json({ message: 'User not found' });
    }

    // --- DEBUG LOG ---
    console.log('Finding profile for user ID:', req.user.id);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Select only the fields we want to send to the frontend
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      // --- DEBUG LOG ---
      console.log('GETMYPROFILE FAILED: User not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }

    // --- DEBUG LOG ---
    console.log('Profile found, sending to frontend:', user);
    res.status(200).json(user);
  } catch (error: unknown) { // <-- FIX: Use 'unknown' instead of 'any'
    // --- DEBUG LOG ---
    let message = 'Server error';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error('GETMYPROFILE FAILED: Server error', message);
    res.status(500).json({ message });
  }
};