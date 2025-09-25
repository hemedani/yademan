"use client";

import React, { useRef, useEffect } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

interface SimpleDrawingProps {
  isActive: boolean;
  onPolygonCreated: (polygon: L.LatLng[][]) => void;
  existingPolygon?: L.LatLng[][];
}

const SimpleDrawing: React.FC<SimpleDrawingProps> = ({
  isActive,
  onPolygonCreated,
  existingPolygon,
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

  const handleCreated = (e: L.DrawEvents.Created) => {
    const { layer } = e;
    if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0] as L.LatLng[];
      onPolygonCreated([latlngs]);
    }
  };

  const handleEdited = (e: L.DrawEvents.Edited) => {
    const layers = e.layers;
    layers.eachLayer((layer: L.Layer) => {
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
              color: "#e1e100",
              message:
                "<strong>Error!</strong> Polygon cannot intersect itself!",
            },
            shapeOptions: {
              color: "#2563eb",
              weight: 3,
              fillOpacity: 0.2,
            },
          },
        }}
        edit={{
          remove: true,
        }}
      />
    </FeatureGroup>
  );
};

export default SimpleDrawing;
