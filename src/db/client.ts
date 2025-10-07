import { PrismaClient } from '@prisma/client';

const database =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: database,
    },
  },
});

export default prisma;
