import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { type UserRole } from '@prisma/client';

// We'll define this type in types/index.ts later
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole; // This is the key change!
}

export const createUser = async (userData: CreateUserDto) => {
  const { email, password, firstName, lastName, role } = userData;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the new user with the specified role
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role, // Assign the role from the request
    },
    select: { // Don't return the password
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  return user;
};