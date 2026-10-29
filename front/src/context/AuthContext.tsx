"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/actions/user/getMe";

export type UserLevel = "Ghost" | "Manager" | "Editor" | "Normal" | null;

interface UserData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  level: string;
  gender: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userLevel: UserLevel;
  user: UserData | null;
  loading: boolean;
  login: (token: string, level: UserLevel, nationalNumber: string) => void;
  logout: () => Promise<void>;
  setInitialAuthState: (isAuth: boolean, level: UserLevel) => void;
  refreshUserData: () => Promise<void>;
  displayName: string;
  initials: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userLevel, setUserLevel] = useState<UserLevel>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const router = useRouter();

  // Hydration effect
  useEffect(() => {
    setHydrated(true);
  }, []);

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUserLevel(null);
    setUser(null);
    Cookies.remove("token", { path: "/" });
    Cookies.remove("national_number", { path: "/" });
    Cookies.remove("user", { path: "/" });
  }, []);

  const applyUser = useCallback((nextUser: UserData) => {
    setUser(nextUser);
    setIsAuthenticated(true);
    setUserLevel(nextUser.level as UserLevel);
  }, []);

  /**
   * Resolves the session from the backend.
   *
   * The level is never read from the `user` cookie: that cookie is
   * client-writable, so trusting it let anyone render the admin UI by setting
   * `level: "Manager"`. A network failure must not destroy the session either —
   * only a missing or rejected token does.
   */
  const resolveSession = useCallback(async () => {
    const token = Cookies.get("token");

    if (!token) {
      setIsAuthenticated(false);
      setUserLevel(null);
      setUser(null);
      return;
    }

    const response = await getMe();

    if (response.success && response.user) {
      applyUser(response.user);
      return;
    }

    if (response.reason === "no_token" || response.reason === "unauthorized") {
      clearAuth();
    }
    // `network`: leave the stored token alone so the next load can restore the
    // session once the backend is reachable again.
  }, [applyUser, clearAuth]);

  // Check authentication status on client-side only
  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    resolveSession()
      .catch(() => {
        // Never clear the session because of an unexpected error.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, resolveSession]);

  const login = useCallback(
    (token: string, level: UserLevel, nationalNumber: string) => {
      // Set cookies
      Cookies.set("token", token, { path: "/" });
      Cookies.set("national_number", nationalNumber, { path: "/" });
      Cookies.set("user", JSON.stringify({ level }), { path: "/" });

      // Update state immediately with temp user
      setIsAuthenticated(true);
      setUserLevel(level);

      const tempUser: UserData = {
        _id: "temp_user",
        first_name: "User",
        last_name: "",
        email: nationalNumber,
        level: level || "Normal",
        gender: "unknown",
        is_verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(tempUser);

      // Refresh with real data
      getMe()
        .then((response) => {
          if (response.success && response.user) applyUser(response.user);
        })
        .catch(() => {
          // Silently handle refresh errors
        });
    },
    [applyUser],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    clearAuth();
    setLoading(false);
    router.replace("/");
  }, [clearAuth, router]);

  const refreshUserData = useCallback(async () => {
    if (!hydrated || !isAuthenticated) return;

    try {
      const response = await getMe();
      if (response.success && response.user) {
        applyUser(response.user);
      }
    } catch {
      // Silently handle refresh errors
    }
  }, [hydrated, isAuthenticated, applyUser]);

  const setInitialAuthState = useCallback(
    (isAuth: boolean, level: UserLevel) => {
      setIsAuthenticated(isAuth);
      setUserLevel(level);
    },
    [],
  );

  // Helper to get display name
  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : "";

  // Helper to get initials
  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "U"
    : "";

  // Memoised so consumers do not re-render on every provider render.
  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      userLevel,
      user,
      loading,
      login,
      logout,
      setInitialAuthState,
      refreshUserData,
      displayName,
      initials,
    }),
    [
      isAuthenticated,
      userLevel,
      user,
      loading,
      login,
      logout,
      setInitialAuthState,
      refreshUserData,
      displayName,
      initials,
    ],
  );

  // Don't render until hydrated to avoid hydration mismatch
  if (!hydrated) {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          userLevel: null,
          user: null,
          loading: true,
          login: () => {},
          logout: async () => {},
          setInitialAuthState: () => {},
          refreshUserData: async () => {},
          displayName: "",
          initials: "",
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
