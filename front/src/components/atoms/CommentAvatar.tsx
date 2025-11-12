import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CommentAvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const CommentAvatar: React.FC<CommentAvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "md",
  glow = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const glowClass = glow
    ? "shadow-[0_0_10px_#FF007A],0_0_20px_#FF007A_inset"
    : "shadow-[0_0_5px_rgba(255,255,255,0.2)]";

  return (
    <motion.div
      className={`${sizeClasses[size]} ${glowClass} rounded-full overflow-hidden flex items-center justify-center bg-gray-200`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className="object-cover"
        />
      ) : (
        <div className="bg-gray-300 w-full h-full flex items-center justify-center">
          <span className="text-gray-500 text-lg">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CommentAvatar;
