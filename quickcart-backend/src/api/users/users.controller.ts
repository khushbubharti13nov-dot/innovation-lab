import type { Request, Response, NextFunction } from 'express';
import * as userService from './users.service.js';

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({ message });
  }
};