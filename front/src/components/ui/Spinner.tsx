// Purpose: A reusable loading spinner component with different sizes and variants

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
  text?: string;
}

const Spinner = ({
  size = "md",
  variant = "primary",
  text,
  className,
  ...props
}: SpinnerProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variants = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className="flex flex-col items-center space-y-2">
        <svg
          className={cn(
            "animate-spin",
            sizes[size],
            variants[variant]
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && (
          <p className={cn("text-gray-600", textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
