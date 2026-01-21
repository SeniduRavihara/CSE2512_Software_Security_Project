import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('User API', () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        // Create Admin
        const admin = await prisma.user.create({
            data: {
                email: 'adminUserTest@test.com',
                password: 'password',
                name: 'Admin User',
                role: 'ADMIN'
            }
        });
        adminToken = jwt.sign({ userId: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET as string);

        // Create Regular User
        const user = await prisma.user.create({
            data: {
                email: 'regularUserTest@test.com',
                password: 'password',
                name: 'Regular User',
                role: 'USER'
            }
        });
        userToken = jwt.sign({ userId: user.id, role: 'USER' }, process.env.JWT_SECRET as string);
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('should allow admin to fetch all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(2); // At least the 2 we created
        expect(res.body[0]).not.toHaveProperty('password'); // Security Check: Password should not be returned
    });

    it('should deny regular user from fetching users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(403);
    });

    it('should deny unauthenticated requests', async () => {
        const res = await request(app)
            .get('/api/users');

        expect(res.statusCode).toEqual(401);
    });
});
