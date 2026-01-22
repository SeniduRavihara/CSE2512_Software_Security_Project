"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken); // All cart routes require auth
router.get('/', cart_controller_1.getCart);
router.post('/items', cart_controller_1.addToCart);
router.patch('/items/:id', cart_controller_1.updateCartItem);
exports.default = router;
