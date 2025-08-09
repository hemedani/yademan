'use client';

import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface MapClickHandlerProps {
  isActive: boolean;
  onMapClick: (latlng: LatLng) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ isActive, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (isActive) {
        onMapClick(e.latlng);
      }
    },
  });

  return null;
};

export default MapClickHandler;
