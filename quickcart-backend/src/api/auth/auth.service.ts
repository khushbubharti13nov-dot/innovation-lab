import { PrismaClient, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';

// --- DTOs (Data Transfer Objects) to replace 'any' ---
interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginUserDto {
  email: string;
  password: string;
}

// --- Register User Service ---
export const registerUser = async (userData: RegisterUserDto) => {
  const { email, password, firstName, lastName } = userData;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'CUSTOMER',
    },
  });

  return generateToken(user.id);
};

// --- Login User Service ---
export const loginUser = async (userData: LoginUserDto) => {
  const { email, password } = userData;
  // --- DEBUG LOGS START ---
  console.log('--- LOGIN ATTEMPT ---');
  console.log('Attempting to log in with email:', email);

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('LOGIN FAILED: User not found in database.');
    throw new Error('Invalid credentials');
  }

  console.log('User found. Checking password...');
  console.log('Password from form:', password);
  console.log('Password from DB (hash):', user.password);
  // --- DEBUG LOGS END ---

  // 2. Check the password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // --- DEBUG LOGS START ---
    console.log(
      'LOGIN FAILED: bcrypt.compare returned false. Passwords do not match.'
    );
    // --- DEBUG LOGS END ---
    throw new Error('Invalid credentials');
  }

  // --- DEBUG LOGS START ---
  console.log('LOGIN SUCCESS: Passwords matched!');
  // --- DEBUG LOGS END ---

  // 3. Generate a token
  return generateToken(user.id);
};

// --- Helper: Generate JWT ---
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};