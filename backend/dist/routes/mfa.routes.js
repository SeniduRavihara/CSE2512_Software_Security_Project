"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mfa_controller_1 = require("../controllers/mfa.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes (require JWT)
router.post('/setup', auth_middleware_1.authenticateToken, mfa_controller_1.setupMFA);
router.post('/verify', auth_middleware_1.authenticateToken, mfa_controller_1.verifyMFA);
router.post('/disable', auth_middleware_1.authenticateToken, mfa_controller_1.disableMFA);
// Public route (used during login flow)
router.post('/validate', mfa_controller_1.validateMFA);
exports.default = router;
