import React from "react";
import { motion } from "framer-motion";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-300 flex items-center justify-center";

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  const variantClasses = {
    primary: "bg-[#FF007A] text-white shadow-[0_0_10px_#FF007A] hover:shadow-[0_0_20px_#FF007A] hover:bg-[#e0006a]",
    secondary: "bg-[#00FF85] text-[#121212] shadow-[0_0_10px_#00FF85] hover:shadow-[0_0_20px_#00FF85] hover:bg-[#00cc6a]",
    ghost: "bg-transparent text-white border border-[#FF007A] shadow-[0_0_10px_rgba(255,0,122,0.5)] hover:shadow-[0_0_20px_rgba(255,0,122,0.8)]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
