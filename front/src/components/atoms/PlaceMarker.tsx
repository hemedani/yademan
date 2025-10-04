"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapCenter } from "@/stores/mapStore";

export interface PlaceData {
  _id: string;
  name: string;
  description: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  category?: {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  };
  tags?: {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  }[];
  thumbnail?: {
    _id?: string;
    name: string;
  };
  gallery?: {
    _id?: string;
    name: string;
    mimType: string;
    size: number;
    alt_text?: string;
  }[];
  virtual_tours?: {
    _id: string;
    name: string;
    description?: string;
    panorama: {
      _id?: string;
      name: string;
    };
    hotspots?: {
      pitch: number;
      yaw: number;
      description?: string;
      target?: string;
    }[];
    status: "draft" | "active" | "archived";
  }[];
  address?: string;
  hoursOfOperation?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: string[];
  };
  updatedAt: Date;
  createdAt: Date;
}

interface PlaceMarkerProps {
  place: PlaceData;
  isSelected?: boolean;
  onClick?: (place: PlaceData) => void;
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

      {/* Tooltip on hover */}
      {(isHovered || isSelected) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] z-20"
        >
          <div className="bg-white rounded-md shadow-lg p-2 text-sm font-medium text-gray-900">
            {place.name}
          </div>
          <div className="w-2 h-2 bg-white transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlaceMarker;
