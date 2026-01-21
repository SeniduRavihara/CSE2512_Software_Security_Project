import { Router } from 'express';
import { getOrders, placeOrder, updateOrderStatus } from '../controllers/order.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', placeOrder);
router.get('/', getOrders);
router.patch('/:id/status', authorizeAdmin, updateOrderStatus);

export default router;
