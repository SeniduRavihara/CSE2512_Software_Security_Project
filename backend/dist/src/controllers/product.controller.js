"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    imageUrl: zod_1.z.string().url(),
});
const getProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;
        const where = {};
        if (search) {
            // Prevent SQL Injection by using Prisma's parameterized queries under the hood
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = Number(minPrice);
            if (maxPrice)
                where.price.lte = Number(maxPrice);
        }
        const products = await prisma_1.default.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        console.error("GetProducts Error:", error);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const validation = createProductSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const data = validation.data;
        const product = await prisma_1.default.product.create({ data });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        // Allow partial updates
        const validation = createProductSchema.partial().safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const data = validation.data;
        const product = await prisma_1.default.product.update({
            where: { id: productId },
            data
        });
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productId = String(id);
        await prisma_1.default.product.delete({ where: { id: productId } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
