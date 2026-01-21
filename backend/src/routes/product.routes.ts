import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Only Routes
router.post('/', authenticateToken, authorizeAdmin, createProduct);
router.patch('/:id', authenticateToken, authorizeAdmin, updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

export default router;
