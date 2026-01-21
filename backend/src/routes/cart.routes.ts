import { Router } from 'express';
import { addToCart, getCart, updateCartItem } from '../controllers/cart.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // All cart routes require auth

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:id', updateCartItem);

export default router;
