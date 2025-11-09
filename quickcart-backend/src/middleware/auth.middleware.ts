import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';

export interface AuthRequest extends Request {
  user?: { id: string } | null;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // --- DEBUG LOG ---
  console.log('--- PROTECT MIDDLEWARE CALLED ---');

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in .env');
    return res.status(500).json({ message: 'Internal server error' });
  }

  // 1. Get token from header
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // --- DEBUG LOG ---
    console.log('Token found:', token);
  }

  // 2. Check if token exists
  if (!token) {
    // --- DEBUG LOG ---
    console.log('PROTECT FAILED: No token found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, secret);
    // --- DEBUG LOG ---
    console.log('Token decoded successfully:', decoded);

    // 4. Check the type of the decoded payload
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded
    ) {
      const payload = decoded as { id: string };

      // 5. Get user from the token ID
      req.user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!req.user) {
        // --- DEBUG LOG ---
        console.log('PROTECT FAILED: User not found in DB for this token');
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' });
      }

      // --- DEBUG LOG ---
      console.log('User attached to request:', req.user);
      next(); // User is valid, proceed
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    // --- DEBUG LOG ---
    console.error('PROTECT FAILED: Token verification failed', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};