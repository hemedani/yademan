// Purpose: Zustand store for managing user authentication state and session data

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  preferences?: {
    notifications: boolean;
    publicProfile: boolean;
    shareLocation: boolean;
  };
}

interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;

  // Loading states
  isLoading: boolean;
  isLoginLoading: boolean;
  isSignupLoading: boolean;

  // Error states
  error: string | null;
  loginError: string | null;
  signupError: string | null;

  // Session management
  lastActivity: number;
  sessionExpiry: number | null;

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoginLoading: (loading: boolean) => void;
  setIsSignupLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLoginError: (error: string | null) => void;
  setSignupError: (error: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateLastActivity: () => void;
  setSessionExpiry: (expiry: number | null) => void;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkSession: () => boolean;
  clearErrors: () => void;

  // Utility methods
  hasRole: (role: string) => boolean;
  isSessionExpired: () => boolean;
  getTimeUntilExpiry: () => number;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isLoginLoading: false,
        isSignupLoading: false,
        error: null,
        loginError: null,
        signupError: null,
        lastActivity: Date.now(),
        sessionExpiry: null,

        // Basic setters
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setIsLoginLoading: (isLoginLoading) => set({ isLoginLoading }),
        setIsSignupLoading: (isSignupLoading) => set({ isSignupLoading }),
        setError: (error) => set({ error }),
        setLoginError: (loginError) => set({ loginError }),
        setSignupError: (signupError) => set({ signupError }),
        setSessionExpiry: (sessionExpiry) => set({ sessionExpiry }),

        updateUser: (updates) => {
          const { user } = get();
          if (user) {
            set({ user: { ...user, ...updates } });
          }
        },

        updateLastActivity: () => {
          set({ lastActivity: Date.now() });
        },

        // Auth methods
        login: async (email: string, password: string) => {
          set({ isLoginLoading: true, loginError: null });

          try {
            const response = await fetch('/api/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'login',
                email,
                password,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();

            set({
              user: data.user,
              isAuthenticated: true,
              loginError: null,
              lastActivity: Date.now(),
              sessionExpiry: Date.now() + (15 * 60 * 1000), // 15 minutes
            });

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            set({ loginError: errorMessage });
            throw error;
          } finally {
            set({ isLoginLoading: false });
          }
        },

        signup: async (email: string, password: string, name: string) => {
          set({ isSignupLoading: true, signupError: null });

          try {
            const response = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
                name,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Signup failed');
            }

            const data = await response.json();

            set({
              user: data.user,
              isAuthenticated: true,
              signupError: null,
              lastActivity: Date.now(),
              sessionExpiry: Date.now() + (15 * 60 * 1000), // 15 minutes
            });

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed';
            set({ signupError: errorMessage });
            throw error;
          } finally {
            set({ isSignupLoading: false });
          }
        },

        logout: () => {
          fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'logout' }),
          }).catch(console.error);

          set({
            user: null,
            isAuthenticated: false,
            error: null,
            loginError: null,
            signupError: null,
            sessionExpiry: null,
            lastActivity: Date.now(),
          });
        },

        refreshToken: async () => {
          set({ isLoading: true });

          try {
            const response = await fetch('/api/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'refresh' }),
            });

            if (!response.ok) {
              throw new Error('Token refresh failed');
            }

            set({
              lastActivity: Date.now(),
              sessionExpiry: Date.now() + (15 * 60 * 1000), // 15 minutes
            });

          } catch (error) {
            console.error('Token refresh failed:', error);
            get().logout();
          } finally {
            set({ isLoading: false });
          }
        },

        checkSession: () => {
          const { user, sessionExpiry } = get();

          if (!user || !sessionExpiry) {
            return false;
          }

          if (Date.now() > sessionExpiry) {
            get().logout();
            return false;
          }

          return true;
        },

        clearErrors: () => {
          set({
            error: null,
            loginError: null,
            signupError: null,
          });
        },

        // Utility methods
        hasRole: (role: string) => {
          const { user } = get();
          if (!user) return false;

          // Admin has all permissions
          if (user.role === 'admin') return true;

          // Moderator has user permissions
          if (user.role === 'moderator' && role === 'user') return true;

          return user.role === role;
        },

        isSessionExpired: () => {
          const { sessionExpiry } = get();
          return sessionExpiry ? Date.now() > sessionExpiry : false;
        },

        getTimeUntilExpiry: () => {
          const { sessionExpiry } = get();
          if (!sessionExpiry) return 0;
          return Math.max(0, sessionExpiry - Date.now());
        },
      }),
      {
        name: 'auth-store',
        // Only persist certain values for security
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          lastActivity: state.lastActivity,
          sessionExpiry: state.sessionExpiry,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Session check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

// Auto-refresh token when close to expiry
let refreshInterval: NodeJS.Timeout | null = null;

// Start session monitoring
export const startSessionMonitoring = () => {
  if (refreshInterval) return;

  refreshInterval = setInterval(() => {
    const store = useAuthStore.getState();

    if (!store.isAuthenticated) {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
      return;
    }

    const timeUntilExpiry = store.getTimeUntilExpiry();

    // Refresh token if less than 5 minutes remaining
    if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
      store.refreshToken();
    }

    // Update last activity
    store.updateLastActivity();

  }, SESSION_CHECK_INTERVAL);
};

// Stop session monitoring
export const stopSessionMonitoring = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Selectors for commonly used values
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useLoginLoading = () => useAuthStore((state) => state.isLoginLoading);
export const useSignupLoading = () => useAuthStore((state) => state.isSignupLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useLoginError = () => useAuthStore((state) => state.loginError);
export const useSignupError = () => useAuthStore((state) => state.signupError);
