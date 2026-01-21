import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('Cart API', () => {
    let userToken: string;
    let productId: string;
    let userId: string;

    // Increase timeout
    jest.setTimeout(30000);

    beforeAll(async () => {
        // Create User
        const user = await prisma.user.create({
            data: {
                email: 'cartuser@test.com',
                password: 'password',
                name: 'Cart User'
            }
        });
        userId = user.id;
        userToken = jwt.sign({ userId: user.id, role: 'USER' }, process.env.JWT_SECRET as string);

        // Create Product
        const product = await prisma.product.create({
            data: {
                name: 'Cart Product',
                description: 'test',
                price: 50.00,
                imageUrl: 'url'
            }
        });
        productId = product.id;
    });

    afterAll(async () => {
        await prisma.cart.deleteMany({ where: { userId } });
        await prisma.product.deleteMany({ where: { name: 'Cart Product' } });
        await prisma.user.deleteMany({ where: { email: 'cartuser@test.com' } });
        await prisma.$disconnect();
    });

    it('should add item to cart', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                productId,
                quantity: 2
            });
        
        expect(res.statusCode).toEqual(200);
    });

    it('should get cart with correct total', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.totalAmount).toEqual(100); // 50 * 2
    });
});
