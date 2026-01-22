"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableMFA = exports.validateMFA = exports.verifyMFA = exports.setupMFA = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const qrcode_1 = __importDefault(require("qrcode"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyTokenSchema = zod_1.z.object({
    token: zod_1.z.string().length(6, "Token must be 6 digits"),
});
/**
 * POST /api/mfa/setup
 * Generate MFA secret and QR code for user to scan
 */
const setupMFA = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.mfaEnabled) {
            return res.status(400).json({ error: 'MFA is already enabled' });
        }
        // Generate secret
        const secret = speakeasy_1.default.generateSecret({
            name: `SecureEcommerce (${user.email})`,
            length: 32,
        });
        // Store secret temporarily (not enabled yet)
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { mfaSecret: secret.base32 }
        });
        // Generate QR code
        const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
        res.json({
            message: 'MFA setup initiated. Scan QR code with your authenticator app.',
            qrCode: qrCodeUrl,
            secret: secret.base32, // For manual entry
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to setup MFA' });
    }
};
exports.setupMFA = setupMFA;
/**
 * POST /api/mfa/verify
 * Verify token and enable MFA
 */
const verifyMFA = async (req, res) => {
    try {
        const userId = req.user.id;
        const validation = verifyTokenSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { token } = validation.data;
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA setup not initiated' });
        }
        // Verify token
        const verified = speakeasy_1.default.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2, // Allow 2 time steps before/after
        });
        if (!verified) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }
        // Enable MFA
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { mfaEnabled: true }
        });
        res.json({ message: 'MFA successfully enabled' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify MFA' });
    }
};
exports.verifyMFA = verifyMFA;
/**
 * POST /api/mfa/validate
 * Validate MFA token during login (called after password verification)
 */
const validateMFA = async (req, res) => {
    try {
        const validation = zod_1.z.object({
            email: zod_1.z.string().email(),
            token: zod_1.z.string().length(6),
        }).safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { email, token } = validation.data;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA not enabled for this user' });
        }
        const verified = speakeasy_1.default.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2,
        });
        if (!verified) {
            return res.status(401).json({ error: 'Invalid MFA code' });
        }
        // Generate JWT token after successful MFA
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            message: 'MFA validated successfully',
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to validate MFA' });
    }
};
exports.validateMFA = validateMFA;
/**
 * POST /api/mfa/disable
 * Disable MFA for user
 */
const disableMFA = async (req, res) => {
    try {
        const userId = req.user.id;
        const validation = verifyTokenSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const { token } = validation.data;
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA is not enabled' });
        }
        // Verify token before disabling
        const verified = speakeasy_1.default.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2,
        });
        if (!verified) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }
        // Disable MFA
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                mfaEnabled: false,
                mfaSecret: null
            }
        });
        res.json({ message: 'MFA successfully disabled' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to disable MFA' });
    }
};
exports.disableMFA = disableMFA;
