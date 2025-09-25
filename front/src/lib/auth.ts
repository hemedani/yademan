// Purpose: Authentication utility functions for session management and user validation

import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { getMe } from "@/app/actions/user/getMe";

/**
 * Get the current authenticated user from backend API
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const response = await getMe();

    if (!response.success || !response.user) {
      return null;
    }

    const backendUser = response.user;

    // Transform backend user to frontend User type
    return {
      id: backendUser._id,
      email: backendUser.email,
      name: `${backendUser.first_name} ${backendUser.last_name}`,
      role: mapBackendRoleToFrontend(backendUser.level),
      avatar: undefined, // Avatar not included in current user type
      createdAt: backendUser.createdAt || new Date().toISOString(),
      updatedAt: backendUser.updatedAt || new Date().toISOString(),
      emailVerified: backendUser.is_verified || false,
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
 * Map backend user level to frontend role
 */
function mapBackendRoleToFrontend(
  level: string,
): "user" | "admin" | "moderator" {
  switch (level) {
    case "Manager":
    case "Ghost":
      return "admin";
    case "Editor":
      return "moderator";
    case "Ordinary":
    default:
      return "user";
  }
}

/**
 * Extract user from request (for API routes) - simplified version
 */
export async function getUserFromRequest(): Promise<User | null> {
  // For now, return null as we're using server-side authentication
  // This would need to be implemented if we need API route authentication
  return null;
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
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Check if user owns a resource
 */
export function canAccessResource(
  user: User | null,
  resourceOwnerId: string,
  requiredRole: string = "user",
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
export async function generateSecureToken(
  length: number = 32,
): Promise<string> {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    const { randomBytes } = await import("crypto");
    const randomBytesResult = randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += characters[randomBytesResult[i] % characters.length];
    }
  }

  return result;
}

/**
 * Hash password using Web Crypto API (browser) or crypto module (Node.js)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await generateSecureToken(16);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${salt}:${hashHex}`;
  } else {
    // Node.js environment
    const { createHash } = await import("crypto");
    const hash = createHash("sha256")
      .update(password + salt)
      .digest("hex");
    return `${salt}:${hash}`;
  }
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const [salt, expectedHash] = hash.split(":");

    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.subtle
    ) {
      // Browser environment
      const encoder = new TextEncoder();
      const data = encoder.encode(password + salt);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const actualHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return actualHash === expectedHash;
    } else {
      // Node.js environment
      const { createHash } = await import("crypto");
      const actualHash = createHash("sha256")
        .update(password + salt)
        .digest("hex");
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
