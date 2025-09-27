"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/actions/user/getMe";
import { AppApi } from "@/services/api";
import { Cookie } from "next/font/google";

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

  // Check authentication status on client-side only
  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      const token = Cookies.get("token");
      const userCookie = Cookies.get("user");
      const nationalNumber = Cookies.get("national_number");

      if (!token) {
        setIsAuthenticated(false);
        setUserLevel(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();

        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          setUserLevel(response.user.level as UserLevel);
        } else {
          // Try fallback from cookies
          try {
            const userCookieData = userCookie ? JSON.parse(userCookie) : null;
            if (userCookieData && userCookieData.level) {
              const fallbackUser: UserData = {
                _id: "temp_user",
                first_name: "User",
                last_name: "",
                email: nationalNumber || "user@example.com",
                level: userCookieData.level,
                gender: "unknown",
                is_verified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setUser(fallbackUser);
              setIsAuthenticated(true);
              setUserLevel(userCookieData.level as UserLevel);
            } else {
              throw new Error("No valid fallback data");
            }
          } catch {
            clearAuth();
          }
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [hydrated]);

  const clearAuth = () => {
    setIsAuthenticated(false);
    setUserLevel(null);
    setUser(null);
    Cookies.remove("token", { path: "/" });
    Cookies.remove("national_number", { path: "/" });
    Cookies.remove("user", { path: "/" });
  };

  const login = (token: string, level: UserLevel, nationalNumber: string) => {
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
    setTimeout(async () => {
      try {
        const response = await getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setUserLevel(response.user.level as UserLevel);
        }
      } catch {
        // Silently handle refresh errors
      }
    }, 100);
  };

  const logout = async () => {
    setLoading(true);

    try {
      const token = Cookies.get("token");
      if (token) {
        Cookies.remove("token", { path: "/" });
      }
    } catch {
      // Silently handle general logout errors
    }

    clearAuth();
    setLoading(false);
    router.replace("/");
  };

  const refreshUserData = async () => {
    if (!hydrated || !isAuthenticated) return;

    try {
      const response = await getMe();
      if (response.success && response.user) {
        setUser(response.user);
        setUserLevel(response.user.level as UserLevel);
      }
    } catch {
      // Silently handle refresh errors
    }
  };

  const setInitialAuthState = (isAuth: boolean, level: UserLevel) => {
    setIsAuthenticated(isAuth);
    setUserLevel(level);
  };

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

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
