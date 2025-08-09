'use client';

import dynamic from 'next/dynamic';
import MapSkeleton from '@/components/map/MapSkeleton';

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

export default function ClientMapWrapper() {
  return <InteractiveMap />;
}
