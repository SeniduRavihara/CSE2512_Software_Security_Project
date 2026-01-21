import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protect route: Only Admins can view all users
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);

export default router;
