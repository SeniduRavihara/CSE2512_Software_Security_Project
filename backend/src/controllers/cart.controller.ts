import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().nonnegative(),
});

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { 
          items: {
              include: { product: true },
              orderBy: { product: { name: 'asc' } }
          } 
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    // SERVER-SIDE CALCULATION: Sum up the total value based on DB prices
    const calculatedTotal = cart.items.reduce((acc: number, item: any) => {
        return acc + (Number(item.product.price) * item.quantity);
    }, 0);

    res.json({ ...cart, totalAmount: calculatedTotal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const validation = addToCartSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { productId, quantity } = validation.data;

    // Security Check: Verify product exists and get REAL price
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params; // CartItem ID
        const cartItemId = String(id); // Ensure it's a string

        const validation = updateCartItemSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { quantity } = validation.data;

        const item = await prisma.cartItem.findUnique({
             where: { id: cartItemId },
             include: { cart: true }
        });

        if (!item || item.cart.userId !== userId) {
            return res.status(404).json({ error: 'Cart item not found or access denied' });
        }

        if (quantity === 0) {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
        } else {
            await prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity }
            });
        }
        
        res.json({ message: 'Cart updated' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart item' });
    }
}
