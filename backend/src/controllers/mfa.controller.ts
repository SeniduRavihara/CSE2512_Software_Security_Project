import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import prisma from '../utils/prisma';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const verifyTokenSchema = z.object({
    token: z.string().length(6, "Token must be 6 digits"),
});

/**
 * POST /api/mfa/setup
 * Generate MFA secret and QR code for user to scan
 */
export const setupMFA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.mfaEnabled) {
            return res.status(400).json({ error: 'MFA is already enabled' });
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `SecureEcommerce (${user.email})`,
            length: 32,
        });

        // Store secret temporarily (not enabled yet)
        await prisma.user.update({
            where: { id: userId },
            data: { mfaSecret: secret.base32 }
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

        res.json({
            message: 'MFA setup initiated. Scan QR code with your authenticator app.',
            qrCode: qrCodeUrl,
            secret: secret.base32, // For manual entry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to setup MFA' });
    }
};

/**
 * POST /api/mfa/verify
 * Verify token and enable MFA
 */
export const verifyMFA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const validation = verifyTokenSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { token } = validation.data;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA setup not initiated' });
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2, // Allow 2 time steps before/after
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }

        // Enable MFA
        await prisma.user.update({
            where: { id: userId },
            data: { mfaEnabled: true }
        });

        res.json({ message: 'MFA successfully enabled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify MFA' });
    }
};

/**
 * POST /api/mfa/validate
 * Validate MFA token during login (called after password verification)
 */
export const validateMFA = async (req: Request, res: Response) => {
    try {
        const validation = z.object({
            email: z.string().email(),
            token: z.string().length(6),
        }).safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { email, token } = validation.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA not enabled for this user' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2,
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid MFA code' });
        }

        // Generate JWT token after successful MFA
        const jwtToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'MFA validated successfully',
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to validate MFA' });
    }
};

/**
 * POST /api/mfa/disable
 * Disable MFA for user
 */
export const disableMFA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const validation = verifyTokenSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { token } = validation.data;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            return res.status(400).json({ error: 'MFA is not enabled' });
        }

        // Verify token before disabling
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: 2,
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }

        // Disable MFA
        await prisma.user.update({
            where: { id: userId },
            data: { 
                mfaEnabled: false,
                mfaSecret: null 
            }
        });

        res.json({ message: 'MFA successfully disabled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to disable MFA' });
    }
};
