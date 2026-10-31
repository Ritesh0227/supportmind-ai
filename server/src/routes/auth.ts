// server/src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { generateToken, verifyToken } from '../utils/security.js';

export const authRouter = Router();

/**
 * Authentication Middleware for Admin-Protected Routes
 */
export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : (req.headers['x-admin-token'] as string);

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Administrator session token is required to perform this action.',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({
        error: 'Invalid or Expired Token',
        message: 'Your administrator session has expired or is invalid. Please sign in again.',
      });
    }

    const adminProfile = await db.getProfileByEmail(decoded.email);
    if (!adminProfile || adminProfile.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have administrative privileges.',
      });
    }

    (req as any).adminUser = adminProfile;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Authentication verification error', details: err.message });
  }
}

// POST /api/auth/login - Administrator Authentication
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing Credentials',
        message: 'Please provide both your administrator email and password.',
      });
    }

    const emailTrimmed = String(email).trim().toLowerCase();
    const admin = await db.verifyAdmin(emailTrimmed, String(password));

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Incorrect administrator email or password. Please verify your credentials.',
        demoCredentials: {
          email: 'admin@supportmind.ai',
          password: 'admin123',
          secondary: 'Admin@SupportMind2026',
        },
      });
    }

    // Generate cryptographic session token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
      message: 'Authentication successful. Redirecting to admin console...',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Authentication failed' });
  }
});

// GET /api/auth/me - Validate current session token
authRouter.get('/me', requireAdminAuth, async (req, res) => {
  const admin = (req as any).adminUser;
  res.json({
    user: {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
    },
  });
});

// POST /api/auth/logout - End admin session
authRouter.post('/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
