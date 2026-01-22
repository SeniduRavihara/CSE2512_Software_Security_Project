"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.placeOrder = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createOrderSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1),
    customerEmail: zod_1.z.string().email(),
    customerAddress: zod_1.z.string().min(5),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const validation = createOrderSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { customerName, customerEmail, customerAddress } = validation.data;
        // 1. Fetch Cart
        const cart = await prisma_1.default.cart.findFirst({
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
        const orderItemsData = cart.items.map((item) => {
            const itemTotal = Number(item.product.price) * item.quantity;
            calculatedTotal += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price // Store the price AT TIME OF PURCHASE
            };
        });
        // 3. Create Order
        const order = await prisma_1.default.order.create({
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
        await prisma_1.default.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};
exports.placeOrder = placeOrder;
const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';
        const where = isAdmin ? {} : { userId };
        const orders = await prisma_1.default.order.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
const updateOrderStatus = async (req, res) => {
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
        const order = await prisma_1.default.order.update({
            where: { id },
            data: { status }
        });
        res.json(order);
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
