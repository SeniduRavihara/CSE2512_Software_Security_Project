import { Router } from 'express';
import { disableMFA, setupMFA, validateMFA, verifyMFA } from '../controllers/mfa.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (require JWT)
router.post('/setup', authenticateToken, setupMFA);
router.post('/verify', authenticateToken, verifyMFA);
router.post('/disable', authenticateToken, disableMFA);

// Public route (used during login flow)
router.post('/validate', validateMFA);

export default router;
