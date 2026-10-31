// server/src/utils/security.ts
import crypto from 'crypto';

const TOKEN_SECRET = process.env.JWT_SECRET || process.env.ADMIN_API_TOKEN || 'supportmind_enterprise_jwt_secret_key_2026';
const DEFAULT_SALT = 'supportmind_salt_secure_2026';

/**
 * Hash password with PBKDF2 (SHA-512) and salt
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Compare plain password against stored hash using timing-safe comparison
 */
export function comparePassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const { hash } = hashPassword(password, salt);
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate a signed session token
 */
export function generateToken(payload: { id: string; email: string; role: string }): string {
  const data = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const jsonStr = JSON.stringify(data);
  const base64Data = Buffer.from(jsonStr).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(base64Data).digest('base64url');
  return `SM.${base64Data}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifyToken(token: string): { id: string; email: string; role: string; exp: number } | null {
  try {
    if (!token || !token.startsWith('SM.')) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [prefix, base64Data, providedSignature] = parts;
    if (prefix !== 'SM') return null;

    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(base64Data).digest('base64url');

    const providedSigBuffer = Buffer.from(providedSignature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (providedSigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(providedSigBuffer, expectedSigBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);

    if (data.exp && Date.now() > data.exp) {
      return null; // Expired
    }

    return data;
  } catch {
    return null;
  }
}
