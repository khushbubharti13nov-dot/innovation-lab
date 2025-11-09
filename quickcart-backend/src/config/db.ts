import { PrismaClient } from '@prisma/client';

// This ensures we only have one instance of PrismaClient in our application
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;