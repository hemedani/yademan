import React from "react";
import { motion } from "framer-motion";

interface RatingInputProps {
  value: number | null;
  onChange?: (rating: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const RatingInput: React.FC<RatingInputProps> = ({
  value = null,
  onChange,
  max = 5,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleClick = (rating: number) => {
    if (onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const ratingValue = i + 1;
        const isFilled = value !== null && ratingValue <= value;

        return (
          <motion.button
            key={ratingValue}
            type="button"
            onClick={() => handleClick(ratingValue)}
            className={
              onChange
                ? "focus:outline-none focus:ring-2 focus:ring-[#FF007A] rounded cursor-pointer"
                : "cursor-default"
            }
            whileHover={onChange ? { scale: 1.1 } : undefined}
            whileTap={onChange ? { scale: 0.9 } : undefined}
            disabled={!onChange}
            aria-label={
              onChange
                ? `Rate ${ratingValue} out of ${max}`
                : `Rating: ${ratingValue} star${ratingValue > 1 ? "s" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeClasses[size]} ${isFilled ? "text-yellow-400" : "text-gray-600"} fill-current`}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </motion.button>
        );
      })}
      {value !== null && (
        <span className="ml-2 text-sm text-gray-400">
          {value} / {max}
        </span>
      )}
    </div>
  );
};

export default RatingInput;
