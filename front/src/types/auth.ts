// Purpose: TypeScript type definitions for authentication and user-related data structures

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: UserPreferences;
  stats?: UserStats;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  mapStyle: string;
  units: 'metric' | 'imperial';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  newReviews: boolean;
  locationUpdates: boolean;
  marketing: boolean;
  weeklyDigest: boolean;
}

export interface PrivacyPreferences {
  publicProfile: boolean;
  shareLocation: boolean;
  showEmail: boolean;
  showFavorites: boolean;
  allowMessages: boolean;
}

export interface UserStats {
  locationsAdded: number;
  reviewsWritten: number;
  favoritesCount: number;
  helpfulVotes: number;
  profileViews: number;
  joinedDaysAgo: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface UpdatePreferencesRequest {
  notifications?: Partial<NotificationPreferences>;
  privacy?: Partial<PrivacyPreferences>;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  mapStyle?: string;
  units?: 'metric' | 'imperial';
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  error: string | null;
  loginError: string | null;
  signupError: string | null;
  lastActivity: number;
  sessionExpiry: number | null;
}

// API response types
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse extends AuthResponse {
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface SignupResponse extends AuthResponse {
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RefreshTokenResponse extends AuthResponse {
  data: {
    tokens: AuthTokens;
  };
}

export interface UserProfileResponse extends AuthResponse {
  data: User;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export interface ProfileFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  general?: string;
}

// Social auth types
export interface SocialAuthProvider {
  id: 'google' | 'facebook' | 'twitter' | 'github';
  name: string;
  icon: string;
  color: string;
}

export interface SocialAuthResponse extends AuthResponse {
  data: {
    user: User;
    tokens: AuthTokens;
    isNewUser: boolean;
  };
}

// Session types
export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    ip: string;
    location?: string;
  };
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent: boolean;
}

export interface ActiveSessionsResponse extends AuthResponse {
  data: SessionInfo[];
}

// Email verification types
export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  token: string;
}

// Two-factor authentication types
export interface TwoFactorSetupResponse extends AuthResponse {
  data: {
    qrCode: string;
    secret: string;
    backupCodes: string[];
  };
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorBackupCode {
  id: string;
  code: string;
  used: boolean;
  usedAt?: string;
}

// Account deletion types
export interface DeleteAccountRequest {
  password: string;
  reason?: string;
  feedback?: string;
}

// Constants
export const USER_ROLES: Record<UserRole, string> = {
  user: 'User',
  admin: 'Administrator',
  moderator: 'Moderator',
};

export const SOCIAL_PROVIDERS: SocialAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '/icons/google.svg',
    color: '#4285f4',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '/icons/facebook.svg',
    color: '#1877f2',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '/icons/twitter.svg',
    color: '#1da1f2',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '/icons/github.svg',
    color: '#333',
  },
];

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
} as const;

export const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
export const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
