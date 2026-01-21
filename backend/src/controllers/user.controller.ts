import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Basic admin check should be in middleware, but safe to filter output here
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
