"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "../../../navigation";
import { loginAction } from "@/app/actions/auth/login";
import { useAuth, UserLevel } from "@/context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(formData.email, formData.password);

      if (result.success && result.token && result.user) {
        // Update AuthContext
        login(result.token, result.user.level as UserLevel, result.user.email);

        // Successful login, redirect to home page
        router.push("/");
        router.refresh(); // Refresh to update auth state
      } else {
        setError(result.error || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch {
      setError("خطای غیرمنتظره رخ داد. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-700/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          {t("email")}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-[#333] rounded-md placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus:border-[#FF007A] sm:text-sm bg-[#1e1e1e] text-white"
            placeholder="example@email.com"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          {t("password")}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-[#333] rounded-md placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus:border-[#FF007A] sm:text-sm bg-[#1e1e1e] text-white"
            placeholder="رمز عبور خود را وارد کنید"
          />
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#FF007A] focus:ring-[#FF007A] border-[#333] bg-[#1e1e1e] rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-white">
            {t("rememberMe")}
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-[#FF007A] hover:text-[#ff339c]"
          >
            {t("forgotPassword")}
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#FF007A] to-[#A020F0] hover:from-[#ff339c] hover:to-[#b53af5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF007A] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="loader w-4 h-4 mr-2"></div>
              در حال ورود...
            </div>
          ) : (
            <>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-[#FF007A] group-hover:text-[#ff339c]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {t("login")}
            </>
          )}
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-[#a0a0a0]">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="font-medium text-[#FF007A] hover:text-[#ff339c]"
          >
            {t("signup")}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
