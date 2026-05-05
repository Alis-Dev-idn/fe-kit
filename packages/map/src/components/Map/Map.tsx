import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapKit } from "../../core/MapKit";
import { MapContext } from "./MapContext";

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  styleUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  styleUrl,
  className = "",
  children,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const config = MapKit.getConfig();

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl || config.styleUrl || "https://demotiles.maplibre.org/style.json",
      center: center || config.defaultCenter,
      zoom: zoom || config.defaultZoom,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update center/zoom if changed from props
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map && zoom !== undefined) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  return (
    <div ref={mapContainer} className={`relative w-full h-full min-h-[400px] overflow-hidden ${className}`}>
      <MapContext.Provider value={{ map }}>
        {map && children}
      </MapContext.Provider>
    </div>
  );
};
