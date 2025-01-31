import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Custom error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class TokenError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

// Environment validation schema
const envSchema = z.object({
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  JWT_EXPIRES_IN: z.number(),
});

// Validate environment variables
const env = envSchema.parse({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || "600"),
});

export interface JWTPayload {
  userId: number;
  phoneNumber: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = 12;
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT tokens for a user
 */
export function generateTokens(payload: JWTPayload): AuthTokens {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    accessToken,
    expiresIn: env.JWT_EXPIRES_IN,
  };
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenError("Token has expired");
    }
    throw new TokenError("Invalid token");
  }
}

/**
 * Extract JWT token from authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}
