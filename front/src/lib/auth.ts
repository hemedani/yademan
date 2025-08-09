// Purpose: Authentication utility functions for JWT handling, session management, and user validation

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { User } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

const JWT_ALGORITHM = "HS256";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Sign a JWT token with user data
 */
export async function signJWT(
  payload: Omit<JWTPayload, "iat" | "exp">,
  expiresIn: string = "15m"
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + parseExpirationTime(expiresIn);

  return await new SignJWT({
    ...payload,
    iat: now,
    exp: expiration,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Get the current authenticated user from cookies
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken) {
      return null;
    }

    const payload = await verifyJWT(accessToken.value);

    if (!payload) {
      return null;
    }

    // In a real app, you'd fetch the full user data from the database
    // For now, we'll return a user object based on the JWT payload
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role as "user" | "admin" | "moderator",
      avatar: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: true,
      preferences: {
        notifications: {
          email: true,
          push: true,
          newReviews: true,
          locationUpdates: true,
          marketing: false,
          weeklyDigest: true,
        },
        privacy: {
          publicProfile: true,
          shareLocation: false,
          showEmail: false,
          showFavorites: true,
          allowMessages: true,
        },
        language: "en",
        theme: "light",
        mapStyle: "streets",
        units: "metric",
      },
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Extract user from request (for API routes)
 */
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("accessToken");

    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (cookieToken) {
      token = cookieToken.value;
    }

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      return null;
    }

    // Return user object based on JWT payload
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role as "user" | "admin" | "moderator",
      avatar: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: true,
      preferences: {
        notifications: {
          email: true,
          push: true,
          newReviews: true,
          locationUpdates: true,
          marketing: false,
          weeklyDigest: true,
        },
        privacy: {
          publicProfile: true,
          shareLocation: false,
          showEmail: false,
          showFavorites: true,
          allowMessages: true,
        },
        language: "en",
        theme: "light",
        mapStyle: "streets",
        units: "metric",
      },
    };
  } catch (error) {
    console.error("Error extracting user from request:", error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRole: string): boolean {
  if (!user) return false;

  const roleHierarchy = {
    user: 1,
    moderator: 2,
    admin: 3,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Check if user owns a resource
 */
export function canAccessResource(
  user: User | null,
  resourceOwnerId: string,
  requiredRole: string = "user"
): boolean {
  if (!user) return false;

  // Admin can access everything
  if (user.role === "admin") return true;

  // User can access their own resources
  if (user.id === resourceOwnerId) return true;

  // Check if user has sufficient role
  return hasRole(user, requiredRole);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // In a browser environment, use crypto.getRandomValues
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += characters[array[i] % characters.length];
    }
  } else {
    // Fallback for Node.js environment
    const crypto = require("crypto");
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += characters[randomBytes[i] % characters.length];
    }
  }

  return result;
}

/**
 * Hash password using Web Crypto API (browser) or crypto module (Node.js)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSecureToken(16);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return `${salt}:${hashHex}`;
  } else {
    // Node.js environment
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256").update(password + salt).digest("hex");
    return `${salt}:${hash}`;
  }
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, expectedHash] = hash.split(":");

    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      // Browser environment
      const encoder = new TextEncoder();
      const data = encoder.encode(password + salt);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const actualHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      return actualHash === expectedHash;
    } else {
      // Node.js environment
      const crypto = require("crypto");
      const actualHash = crypto.createHash("sha256").update(password + salt).digest("hex");
      return actualHash === expectedHash;
    }
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    score += 1;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  // Bonus points for length
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5), // Max score of 5
  };
}

/**
 * Parse expiration time string to seconds
 */
function parseExpirationTime(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error("Invalid expiration time format");
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      throw new Error("Invalid time unit");
  }
}

/**
 * Check if session is expired
 */
export function isSessionExpired(expirationTime: number): boolean {
  return Date.now() > expirationTime * 1000;
}

/**
 * Get time until session expires in milliseconds
 */
export function getTimeUntilExpiry(expirationTime: number): number {
  return Math.max(0, expirationTime * 1000 - Date.now());
}

/**
 * Format time remaining until expiry
 */
export function formatTimeUntilExpiry(expirationTime: number): string {
  const timeLeft = getTimeUntilExpiry(expirationTime);

  if (timeLeft <= 0) return "Expired";

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}
