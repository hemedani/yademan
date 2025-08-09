// Purpose: Loading skeleton component for the map while it's initializing

import { cn } from "@/lib/utils";

interface MapSkeletonProps {
  className?: string;
  height?: string;
}

const MapSkeleton = ({ className, height = "100%" }: MapSkeletonProps) => {
  return (
    <div
      className={cn("relative bg-gray-100 animate-pulse", className)}
      style={{ height }}
    >
      {/* Map container skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

      {/* Navigation controls skeleton */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="w-8 h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-8 h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-8 h-8 bg-gray-300 rounded shadow-md" />
      </div>

      {/* Map controls skeleton */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="w-24 h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-20 h-8 bg-gray-300 rounded shadow-md" />
        <div className="w-28 h-8 bg-gray-300 rounded shadow-md" />
      </div>

      {/* Fake location markers */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full shadow-md animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-400 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-green-400 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.4s' }} />
      <div className="absolute top-1/3 left-2/4 w-3 h-3 bg-yellow-400 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.6s' }} />

      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs mx-auto">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <div className="text-gray-600">
              <div className="font-medium">Loading Map</div>
              <div className="text-sm text-gray-500">Initializing MapLibre GL JS...</div>
            </div>
          </div>

          {/* Progress bar simulation */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid pattern overlay for visual interest */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }, (_, i) => (
            <div key={i} className="border border-gray-400" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSkeleton;
