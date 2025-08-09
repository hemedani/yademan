'use client';

import React, { useRef, useEffect } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

interface SimpleDrawingProps {
  isActive: boolean;
  onPolygonCreated: (polygon: L.LatLng[][]) => void;
  existingPolygon?: L.LatLng[][];
}

const SimpleDrawing: React.FC<SimpleDrawingProps> = ({
  isActive,
  onPolygonCreated,
  existingPolygon
}) => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (existingPolygon && featureGroupRef.current) {
      // Clear existing layers
      featureGroupRef.current.clearLayers();

      // Add existing polygon
      const polygon = L.polygon(existingPolygon);
      featureGroupRef.current.addLayer(polygon);
    }
  }, [existingPolygon]);

  const handleCreated = (e: any) => {
    const { layer } = e;
    if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0] as L.LatLng[];
      onPolygonCreated([latlngs]);
    }
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs()[0] as L.LatLng[];
        onPolygonCreated([latlngs]);
      }
    });
  };

  const handleDeleted = () => {
    onPolygonCreated([]);
  };

  if (!isActive) {
    return null;
  }

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onCreated={handleCreated}
        onEdited={handleEdited}
        onDeleted={handleDeleted}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Error!</strong> Polygon cannot intersect itself!'
            },
            shapeOptions: {
              color: '#2563eb',
              weight: 3,
              fillOpacity: 0.2
            }
          }
        }}
        edit={{
          featureGroup: featureGroupRef.current!,
          remove: true,
          edit: true
        }}
      />
    </FeatureGroup>
  );
};

export default SimpleDrawing;
