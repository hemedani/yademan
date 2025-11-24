"use client";

import React, { useRef, useEffect } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

// Fix for "wrong event specified: touchleave" error
// This extends Leaflet's capabilities for touch devices
if (typeof window !== "undefined") {
  L.Draw.Polyline.prototype._onTouch = (L.Util as any).falseFn;
  L.Draw.Polygon.prototype._onTouch = (L.Util as any).falseFn;
  L.Draw.Rectangle.prototype._onTouch = (L.Util as any).falseFn;
  L.Draw.Circle.prototype._onTouch = (L.Util as any).falseFn;
  L.Draw.Marker.prototype._onTouch = (L.Util as any).falseFn;
}

interface SimpleDrawingProps {
  isActive: boolean;
  onPolygonCreated: (polygon: L.LatLng[][]) => void;
  onPolygonDeleted?: () => void;
  existingPolygon?: L.LatLng[][];
}

const SimpleDrawing: React.FC<SimpleDrawingProps> = ({
  isActive,
  onPolygonCreated,
  onPolygonDeleted,
  existingPolygon,
}) => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Disable touch events that cause problems
  useEffect(() => {
    // Set Leaflet's tap handler to be disabled for browsers where touch !== pointer
    if (
      typeof window !== "undefined" &&
      L.Browser.touch &&
      !L.Browser.pointer
    ) {
      L.DomEvent.disableClickPropagation = (L.DomUtil as any).falseFn;
    }
  }, []);

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
    // Call the onPolygonDeleted callback if provided
    onPolygonDeleted?.();
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
        onDrawStart={() => console.log("Draw started")}
        onDrawStop={() => console.log("Draw stopped")}
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
      />
    </FeatureGroup>
  );
};

export default SimpleDrawing;
