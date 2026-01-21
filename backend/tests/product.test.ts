import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('Product API', () => {
  let adminToken: string;

  jest.setTimeout(30000);

  beforeAll(async () => {
     // Create Admin
     const admin = await prisma.user.create({
         data: {
             email: 'admin@test.com',
             password: 'hashedpassword',
             name: 'Admin',
             role: 'ADMIN'
         }
     });

     adminToken = jwt.sign({ userId: admin.id, role: admin.role }, process.env.JWT_SECRET as string);
  });

  afterAll(async () => {
      // Cleanup dependencies first
      await prisma.product.deleteMany({ where: { name: 'Test Laptop' } });
      await prisma.user.deleteMany({ where: { email: 'admin@test.com' } });
      await prisma.$disconnect();
  });

  it('should create a product (Admin)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Test Laptop',
            description: 'Powerful laptop',
            price: 999.99,
            imageUrl: 'http://example.com/image.png'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('Test Laptop');
  });

  it('should list products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
  });
});
