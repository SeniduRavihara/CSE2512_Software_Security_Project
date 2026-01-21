import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    const where: any = {};

    if (search) {
        // Prevent SQL Injection by using Prisma's parameterized queries under the hood
        where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
        ];
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error("GetProducts Error:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const validation = createProductSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        
        const data = validation.data;
        const product = await prisma.product.create({ data });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        // Allow partial updates
        const validation = createProductSchema.partial().safeParse(req.body); 
        
        if (!validation.success) {
             return res.status(400).json({ error: validation.error.errors });
        }

        const data = validation.data;
        const product = await prisma.product.update({ 
            where: { id: productId },
            data
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        await prisma.product.delete({ where: { id: productId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
