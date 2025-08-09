// JWT utility functions for authentication

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  level: string;
  iat: number;
  exp: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Mock JWT implementation for development
export class JWT {
  private static readonly SECRET = 'mock-secret-key';

  static async sign(payload: Partial<JWTPayload>): Promise<string> {
    // Mock implementation - in production use a proper JWT library
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('mock-signature');

    return `${header}.${body}.${signature}`;
  }

  static async verify(token: string): Promise<JWTPayload | null> {
    try {
      // Mock implementation - in production use a proper JWT library
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async decode(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static isExpired(token: string): boolean {
    try {
      const payload = this.decode(token);
      if (!payload || !payload.exp) return true;

      return payload.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      return true;
    }
  }

  static getExpirationTime(token: string): number | null {
    try {
      const payload = this.decode(token);
      return payload?.exp || null;
    } catch (error) {
      return null;
    }
  }
}

export default JWT;
