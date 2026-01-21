import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerAddress: z.string().min(5),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { customerName, customerEmail, customerAddress } = validation.data;

    // 1. Fetch Cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. SERVER-SIDE PRICE CALCULATION (CRITICAL SECURITY)
    // We iterate over cart items and sum up (product.price * quantity) directly from DB data.
    // We DO NOT trust any total sent from the client.
    let calculatedTotal = 0;
    const orderItemsData = cart.items.map((item: any) => {
        const itemTotal = Number(item.product.price) * item.quantity;
        calculatedTotal += itemTotal;
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price // Store the price AT TIME OF PURCHASE
        };
    });

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        userId,
        customerName,
        customerEmail,
        customerAddress,
        totalAmount: calculatedTotal,
        status: 'PENDING',
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    // 4. Clear Cart
    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const isAdmin = req.user!.role === 'ADMIN';

        const where = isAdmin ? {} : { userId };

        const orders = await prisma.order.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!id || typeof id !== 'string') {
           return res.status(400).json({ error: 'Valid Order ID required' }); 
        }
        const validation = updateStatusSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { status } = validation.data;

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}
