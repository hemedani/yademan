"use client";

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

interface MapLayerSwitcherProps {
  layers: MapLayer[];
  currentLayer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
}

const MapLayerSwitcher: React.FC<MapLayerSwitcherProps> = ({
  layers,
  currentLayer,
  onLayerChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case "osm-standard":
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
      case "osm-vector":
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
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        );
      case "satellite":
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
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "terrain":
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
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1-4.5 2.986-6C14 5.5 16.09 7.09 17.656 8.657a8.003 8.003 0 010 11.314z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.879 16.121A3 3 0 1012.015 11L11 14.015 9.879 16.12z"
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
      case "osm-standard":
        return (
          <div className={`${previewClasses} bg-gradient-to-br from-gray-100 to-gray-200`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="space-y-1">
                <div className="w-8 h-0.5 bg-gray-400" />
                <div className="w-6 h-0.5 bg-gray-400 ml-2" />
                <div className="w-7 h-0.5 bg-gray-400" />
              </div>
            </div>
          </div>
        );
      case "osm-vector":
        return (
          <div className={`${previewClasses} bg-gradient-to-br from-blue-50 to-blue-100`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-blue-300 rounded-sm" />
                <div className="w-3 h-3 bg-blue-400 rounded-sm" />
                <div className="w-3 h-3 bg-blue-400 rounded-sm" />
                <div className="w-3 h-3 bg-blue-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case "satellite":
        return (
          <div className={`${previewClasses} bg-gradient-to-br from-green-900 to-green-700`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );
      case "terrain":
        return (
          <div className={`${previewClasses} bg-gradient-to-br from-amber-100 to-amber-200`}>
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6z" />
              </svg>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${previewClasses} bg-gradient-to-br from-gray-200 to-gray-300`}>
            <div className="w-full h-full" />
          </div>
        );
    }
  };

  return (
    <div className="absolute right-4 top-20 z-40">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg transition-shadow"
        aria-label="تغییر نوع نقشه"
        title="تغییر نوع نقشه"
      >
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Layer Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-[180px] z-40"
            >
              <div className="space-y-2">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => {
                      onLayerChange(layer);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                      currentLayer.id === layer.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Layer Preview */}
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                      {getLayerPreview(layer.id)}
                    </div>

                    {/* Layer Info */}
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            currentLayer.id === layer.id
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {layer.name}
                        </span>
                        {currentLayer.id === layer.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-blue-600 rounded-full"
                          />
                        )}
                      </div>
                      {layer.id === "satellite" && (
                        <span className="text-xs text-gray-500">ماهواره‌ای</span>
                      )}
                      {layer.id === "terrain" && (
                        <span className="text-xs text-gray-500">توپوگرافی</span>
                      )}
                      {layer.id === "osm-vector" && (
                        <span className="text-xs text-gray-500">برداری</span>
                      )}
                      {layer.id === "osm-standard" && (
                        <span className="text-xs text-gray-500">استاندارد</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Options */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span>نمایش ترافیک</span>
                </label>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapLayerSwitcher;
