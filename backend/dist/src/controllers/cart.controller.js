"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().positive(),
});
const updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().nonnegative(),
});
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await prisma_1.default.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                    orderBy: { product: { name: 'asc' } }
                }
            }
        });
        if (!cart) {
            cart = await prisma_1.default.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } }
            });
        }
        // SERVER-SIDE CALCULATION: Sum up the total value based on DB prices
        const calculatedTotal = cart.items.reduce((acc, item) => {
            return acc + (Number(item.product.price) * item.quantity);
        }, 0);
        res.json({ ...cart, totalAmount: calculatedTotal });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const validation = addToCartSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { productId, quantity } = validation.data;
        // Security Check: Verify product exists and get REAL price
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let cart = await prisma_1.default.cart.findFirst({ where: { userId } });
        if (!cart) {
            cart = await prisma_1.default.cart.create({ data: { userId } });
        }
        const existingItem = await prisma_1.default.cartItem.findFirst({
            where: { cartId: cart.id, productId }
        });
        if (existingItem) {
            await prisma_1.default.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }
        else {
            await prisma_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }
        res.status(200).json({ message: 'Item added to cart' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // CartItem ID
        const cartItemId = String(id); // Ensure it's a string
        const validation = updateCartItemSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { quantity } = validation.data;
        const item = await prisma_1.default.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });
        if (!item || item.cart.userId !== userId) {
            return res.status(404).json({ error: 'Cart item not found or access denied' });
        }
        if (quantity === 0) {
            await prisma_1.default.cartItem.delete({ where: { id: cartItemId } });
        }
        else {
            await prisma_1.default.cartItem.update({
                where: { id: cartItemId },
                data: { quantity }
            });
        }
        res.json({ message: 'Cart updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};
exports.updateCartItem = updateCartItem;
