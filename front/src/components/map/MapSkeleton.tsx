// Purpose: Loading skeleton component for the map while it's initializing

import { cn } from "@/lib/utils";

interface MapSkeletonProps {
  className?: string;
  height?: string;
}

const MapSkeleton = ({ className, height = "100%" }: MapSkeletonProps) => {
  return (
    <div
      className={cn(
        "relative bg-[#0a0a00] animate-pulse w-full overflow-hidden",
        className,
      )}
      style={{ height }}
    >
      {/* Map container skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

      {/* Navigation controls skeleton - Mobile responsive */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 space-y-1 sm:space-y-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded shadow-md" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded shadow-md" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded shadow-md" />
      </div>

      {/* Map controls skeleton - Mobile responsive */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 space-y-1 sm:space-y-2">
        <div className="w-16 h-6 sm:w-24 sm:h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-14 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-20 h-6 sm:w-28 sm:h-8 bg-gray-300 rounded shadow-md" />
      </div>

      {/* Fake location markers - Responsive sizing */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full shadow-md animate-pulse" />
      <div
        className="absolute top-1/2 left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full shadow-md animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="absolute top-2/3 left-2/3 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full shadow-md animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
      <div
        className="absolute top-1/3 left-2/4 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full shadow-md animate-pulse"
        style={{ animationDelay: "0.6s" }}
      />

      {/* Loading indicator - Mobile responsive */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#121212] border border-[#333] rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm mx-auto">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#FF007A] flex-shrink-0" />
            <div className="text-[#a0a0a0] min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base text-white">
                در حال بارگذاری نقشه
              </div>
              <div className="text-xs sm:text-sm text-[#a0a0a0]">
                راه‌اندازی MapLibre GL JS...
              </div>
            </div>
          </div>

          {/* Progress bar simulation */}
          <div className="mt-3 sm:mt-4">
            <div className="bg-[#1e1e1e] rounded-full h-2 sm:h-3">
              <div
                className="bg-[#FF007A] h-2 sm:h-3 rounded-full animate-pulse transition-all duration-300"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid pattern overlay for visual interest - Hidden on small screens */}
      <div className="absolute inset-0 opacity-5 hidden sm:block">
        <div className="grid grid-cols-8 sm:grid-cols-12 h-full">
          {Array.from({ length: 96 }, (_, i) => (
            <div key={i} className="border border-gray-400" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSkeleton;
