"use client";
// File Address
// src/components/map/LayerControl.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

interface LayerControlProps {
  layers: MapLayer[];
  currentLayer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  currentLayer,
  onLayerChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case "standard":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
      case "humanitarian":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l7.5-7.5M3 12h6m-6 0L12 21m0 0l6-9m-6 0h6"
            />
          </svg>
        );
      case "cyclosm":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "darkmatter":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        );
    }
  };

  const getLayerPreview = (layerId: string) => {
    const previewClasses = "w-full h-full rounded";
    switch (layerId) {
      case "standard":
        return (
          <div
            className={`${previewClasses} bg-gradient-to-br from-gray-100 to-gray-200`}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="space-y-1">
                <div className="w-8 h-0.5 bg-gray-400" />
                <div className="w-6 h-0.5 bg-gray-400 ml-2" />
                <div className="w-7 h-0.5 bg-gray-400" />
              </div>
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse" />
            </div>
          </div>
        );
      case "humanitarian":
        return (
          <div
            className={`${previewClasses} bg-gradient-to-br from-blue-200 to-green-200`}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse" />
            </div>
          </div>
        );
      case "cyclosm":
        return (
          <div
            className={`${previewClasses} bg-gradient-to-br from-green-100 to-green-300`}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse" />
            </div>
          </div>
        );
      case "darkmatter":
        return (
          <div
            className={`${previewClasses} bg-gradient-to-br from-gray-900 to-black`}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="grid grid-cols-3 gap-0.5">
                <div className="w-1 h-1 bg-[#FF007A] rounded-sm" />
                <div className="w-1 h-1 bg-[#00FF85] rounded-sm" />
                <div className="w-1 h-1 bg-[#A020F0] rounded-sm" />
                <div className="w-1 h-1 bg-[#BFFF00] rounded-sm" />
                <div className="w-1 h-1 bg-[#FF007A] rounded-sm" />
                <div className="w-1 h-1 bg-[#00FF85] rounded-sm" />
              </div>
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse" />
            </div>
          </div>
        );
      default:
        return (
          <div
            className={`${previewClasses} bg-gradient-to-br from-gray-200 to-gray-300`}
          >
            <div className="w-full h-full relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute right-4 top-20 z-40">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF007A" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-[#FF007A] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_#FF007A] relative overflow-hidden"
        aria-label={t("map.layerControl.toggleLabel") || "تغییر نوع نقشه"}
        title={t("map.layerControl.toggleLabel") || "تغییر نوع نقشه"}
      >
        {/* Cyberpunk glow effect */}
        <div className="absolute inset-0 rounded-lg bg-[#FF007A] opacity-0 hover:opacity-10 transition-opacity duration-300" />
        {getLayerIcon(currentLayer.id)}
      </motion.button>

      {/* Layer Options */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Layer Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-14 right-0 bg-black/70 backdrop-blur-lg rounded-xl shadow-2xl border border-[#FF007A] p-3 min-w-[180px] z-40 overflow-hidden"
            >
              <div className="space-y-2">
                {layers.map((layer) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={layer.id}
                    onClick={() => {
                      onLayerChange(layer);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all relative overflow-hidden ${
                      currentLayer.id === layer.id
                        ? "bg-[#1e1e1e]/80 border border-[#FF007A] shadow-[0_0_15px_rgba(255,0,122,0.5)]"
                        : "hover:bg-[#1e1e1e]/60 border border-transparent hover:border-[#FF007A]/50"
                    }`}
                  >
                    {/* Cyberpunk glow effect */}
                    <div
                      className={`absolute inset-0 rounded-lg bg-[#FF007A] opacity-0 ${currentLayer.id === layer.id ? "opacity-10" : "group-hover:opacity-5"} transition-opacity duration-300`}
                    />

                    {/* Layer Preview */}
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-[#333] relative z-10">
                      {getLayerPreview(layer.id)}
                    </div>

                    {/* Layer Info */}
                    <div className="flex-1 text-right relative z-10">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            currentLayer.id === layer.id
                              ? "text-[#FF007A]"
                              : "text-white"
                          }`}
                        >
                          {t(`map.layerControl.layers.${layer.id}`) ||
                            layer.name}
                        </span>
                        {currentLayer.id === layer.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-[#FF007A] rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LayerControl;
