"use client";

import dynamic from "next/dynamic";
import MapSkeleton from "@/components/map/MapSkeleton";

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/map/InteractiveMap"),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
);

interface ClientMapWrapperProps {
  onLoad?: () => void;
}

export default function ClientMapWrapper({ onLoad }: ClientMapWrapperProps) {
  return <InteractiveMap onLoad={onLoad} />;
}
