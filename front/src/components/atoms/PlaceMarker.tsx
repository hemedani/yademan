"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapCenter } from "@/stores/mapStore";
import { placeSchema } from "@/types/declarations/selectInp";

interface PlaceMarkerProps {
  place: placeSchema;
  isSelected?: boolean;
  onClick?: (place: placeSchema) => void;
}

const getMarkerColor = (category?: { color?: string }) => {
  return category?.color || "#4f46e5"; // Default to indigo if no category color
};

const getMarkerIcon = (category?: { icon?: string }) => {
  // Default icon if no category icon is specified
  return category?.icon || "location-dot";
};

const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  place,
  isSelected = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const markerColor = useMemo(
    () => getMarkerColor(place.category),
    [place.category],
  );
  const markerIcon = useMemo(
    () => getMarkerIcon(place.category),
    [place.category],
  );

  const handleClick = () => {
    if (onClick) {
      onClick(place);
    }
  };

  // Using framer-motion for smooth animations
  return (
    <motion.div
      className={`relative cursor-pointer group`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse animation for selected markers */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-current"
          style={{ color: markerColor }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0.2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}

      {/* Main marker */}
      <div
        className={`
          relative z-10 flex items-center justify-center
          w-8 h-8 rounded-full shadow-lg
          ${isSelected ? "ring-2 ring-white" : ""}
        `}
        style={{ backgroundColor: markerColor }}
      >
        <i className={`fa fa-${markerIcon} text-white text-sm`}></i>
      </div>
    </motion.div>
  );
};

export default PlaceMarker;
