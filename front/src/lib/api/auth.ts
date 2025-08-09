// Authentication API utilities

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      level: string;
      createdAt: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Mock API implementation
export class AuthAPI {
  private static readonly BASE_URL = '/api/auth';

  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (data.email === 'test@example.com' && data.password === 'password') {
        return {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              name: 'کاربر تست',
              email: data.email,
              level: 'user',
              createdAt: new Date().toISOString()
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresIn: 3600
            }
          }
        };
      } else {
        return {
          success: false,
          message: 'نام کاربری یا رمز عبور اشتباه است',
          error: 'INVALID_CREDENTIALS'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'خطا در اتصال به سرور',
        error: 'SERVER_ERROR'
      };
    }
  }

  static async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (data.email === 'existing@example.com') {
        return {
          success: false,
          message: 'این ایمیل قبلاً ثبت شده است',
          error: 'EMAIL_EXISTS'
        };
      }

      return {
        success: true,
        message: 'ثبت نام با موفقیت انجام شد',
        data: {
          user: {
            id: '2',
            name: data.name,
            email: data.email,
            level: 'user',
            createdAt: new Date().toISOString()
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در ثبت نام',
        error: 'SERVER_ERROR'
      };
    }
  }

  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: 'خروج با موفقیت انجام شد'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در خروج از حساب کاربری'
      };
    }
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (data.refreshToken === 'mock-refresh-token') {
        return {
          success: true,
          message: 'Token refreshed successfully',
          data: {
            user: {
              id: '1',
              name: 'کاربر تست',
              email: 'test@example.com',
              level: 'user',
              createdAt: new Date().toISOString()
            },
            tokens: {
              accessToken: 'new-mock-access-token',
              refreshToken: 'new-mock-refresh-token',
              expiresIn: 3600
            }
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid refresh token',
          error: 'INVALID_TOKEN'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'خطا در تمدید توکن',
        error: 'SERVER_ERROR'
      };
    }
  }

  static async verifyEmail(data: VerifyEmailRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'ایمیل با موفقیت تأیید شد'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در تأیید ایمیل'
      };
    }
  }

  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در ارسال ایمیل بازیابی'
      };
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'رمز عبور با موفقیت تغییر یافت'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در تغییر رمز عبور'
      };
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check if user is logged in (mock check)
      const token = localStorage.getItem('accessToken');
      if (!token || token === 'null') {
        return {
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        };
      }

      return {
        success: true,
        message: 'User data retrieved successfully',
        data: {
          user: {
            id: '1',
            name: 'کاربر تست',
            email: 'test@example.com',
            level: 'user',
            createdAt: new Date().toISOString()
          },
          tokens: {
            accessToken: token,
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطا در دریافت اطلاعات کاربر',
        error: 'SERVER_ERROR'
      };
    }
  }
}

export default AuthAPI;
