import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('Order API', () => {
    let userToken: string;
    let adminToken: string;
    let productId: string;
    let userId: string;

    jest.setTimeout(30000);

    beforeAll(async () => {
        // Create User
        const user = await prisma.user.create({
            data: {
                email: 'orderuser@test.com',
                password: 'password',
                name: 'Order User'
            }
        });
        userId = user.id;
        userToken = jwt.sign({ userId: user.id, role: 'USER' }, process.env.JWT_SECRET as string);

        // Create Admin
        const admin = await prisma.user.create({
            data: {
                email: 'adminOrder@test.com',
                password: 'password',
                name: 'Order Admin',
                role: 'ADMIN'
            }
        });
        adminToken = jwt.sign({ userId: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET as string);

        // Create Product
        const product = await prisma.product.create({
            data: {
                name: 'Order Product',
                description: 'test',
                price: 100.00,
                imageUrl: 'url'
            }
        });
        productId = product.id;
    });

    afterAll(async () => {
        await prisma.orderItem.deleteMany(); // Cascade usually handles this if we delete orders, but safety first
        await prisma.order.deleteMany({ where: { OR: [{ customerName: 'John Doe' }, { customerName: 'Test' }] } }); // Clean created orders
        await prisma.cart.deleteMany({ where: { userId } });
        await prisma.product.deleteMany({ where: { name: 'Order Product' } });
        await prisma.user.deleteMany({ where: { email: { in: ['orderuser@test.com', 'adminOrder@test.com'] } } });
        await prisma.$disconnect();
    });

    it('should place an order securely', async () => {
        // 1. Add to Cart first
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ productId, quantity: 1 });

        // 2. Place Order
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerAddress: '123 Street'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('orderId');

        // 3. Verify Order Total in DB (Security Check)
        const order = await prisma.order.findUnique({ where: { id: res.body.orderId } });
        expect(Number(order?.totalAmount)).toEqual(100);
    });

    it('should allow admin to update order status', async () => {
        // Place an order first (reusing logic or creating new)
        // We can just create one directly in DB to save time/isolation
        const order = await prisma.order.create({
            data: {
                customerName: 'Test',
                customerEmail: 'test@test.com',
                customerAddress: 'Addr',
                totalAmount: 50,
                status: 'PENDING'
            }
        });

        const res = await request(app)
            .patch(`/api/orders/${order.id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'SHIPPED' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('SHIPPED');

        const updated = await prisma.order.findUnique({ where: { id: order.id } });
        expect(updated?.status).toEqual('SHIPPED');
    });
});
