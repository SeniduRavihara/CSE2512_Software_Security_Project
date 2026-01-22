import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

const prisma = mockDeep<PrismaClient>();
export default prisma;
export const prismaMock = prisma;
