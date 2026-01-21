import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import mfaRoutes from './routes/mfa.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/users', userRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Secure E-Commerce Backend is running');
});

export default app;
