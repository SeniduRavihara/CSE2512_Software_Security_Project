import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

describe('Auth API', () => {
  jest.setTimeout(30000);
  
  beforeAll(async () => {
    // Clean DB - only test artifacts
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should not register existing user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User 2'
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should login valid user', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
