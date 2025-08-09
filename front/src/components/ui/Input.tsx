// Purpose: A reusable input component with various types and validation states

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outline";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = "text",
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = "default",
    disabled,
    ...props
  }, ref) => {
    const baseStyles = "w-full px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
      default: "border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-blue-500",
      filled: "border-0 rounded-lg bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-1",
      outline: "border-2 border-gray-200 rounded-lg bg-transparent hover:border-gray-300 focus:border-blue-500",
    };

    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              baseStyles,
              variants[variant],
              errorStyles,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
