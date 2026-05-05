import React, { useState, useEffect } from "react";
import { useMapContext } from "../Map/MapContext";

export interface DrawControlProps {
  mode?: "polygon" | "line" | "point" | "none";
  onCreate?: (feature: any) => void;
  onUpdate?: (feature: any) => void;
  active?: boolean;
}

export const DrawControl: React.FC<DrawControlProps> = ({
  mode = "none",
  onCreate,
  onUpdate,
  active = false,
}) => {
  const { map } = useMapContext();
  const [points, setPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!map || mode === "none" || !active) {
      setPoints([]);
      return;
    }

    const handleClick = (e: any) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      if (mode === "point") {
        const feature = { type: "Feature", geometry: { type: "Point", coordinates: coords } };
        onCreate?.(feature);
        return;
      }

      const newPoints = [...points, coords];
      setPoints(newPoints);

      if (mode === "line" && newPoints.length >= 2) {
        const feature = { type: "Feature", geometry: { type: "LineString", coordinates: newPoints } };
        onUpdate?.(feature);
      } else if (mode === "polygon" && newPoints.length >= 3) {
        const feature = { type: "Feature", geometry: { type: "Polygon", coordinates: [[...newPoints, newPoints[0]]] } };
        onUpdate?.(feature);
      }
    };

    const handleDoubleClick = () => {
      if (mode === "line" || mode === "polygon") {
        let finalFeature;
        if (mode === "line") {
          finalFeature = { type: "Feature", geometry: { type: "LineString", coordinates: points } };
        } else {
          finalFeature = { type: "Feature", geometry: { type: "Polygon", coordinates: [[...points, points[0]]] } };
        }
        onCreate?.(finalFeature);
        setPoints([]);
      }
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDoubleClick);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDoubleClick);
    };
  }, [map, mode, active, points]);

  // Visual feedback for current drawing
  // (In a real implementation we would use a dynamic GeoJsonLayer here)

  return null;
};
