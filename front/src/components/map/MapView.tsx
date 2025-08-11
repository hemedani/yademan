"use client";

import { Suspense } from "react";
import ClientMapWrapper from "@/components/ClientMapWrapper";
import MapSkeleton from "@/components/map/MapSkeleton";

interface MapViewProps {
  className?: string;
}

export default function MapView({ className = "" }: MapViewProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={<MapSkeleton className="w-full h-full" />}>
        <div className="absolute inset-0 w-full h-full">
          <ClientMapWrapper />
        </div>
      </Suspense>
    </div>
  );
}
