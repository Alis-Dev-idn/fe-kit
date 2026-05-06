import React from "react";
import { 
  Map, 
  Marker, 
  Popup, 
  MapOverlay,
  MapStyleSwitcher
} from "@alisdev/fe-kit-map";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { Callout } from "../components/shared/Callout";
import { Card, Button, Badge, Stack } from "@alisdev/fe-kit-ui";

export const MapPage: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="Display" />
        <h1 className="text-4xl font-bold mb-4">Map Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          High-performance geospatial visualization library built on MapLibre GL. 
          Supports clustering, real-time tracking, and custom React overlays.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-map" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Interactive Map</h2>
        <DemoArea>
          <div className="h-[500px] rounded-xl overflow-hidden border border-border relative">
            <Map 
              center={[106.8272, -6.1751]} 
              zoom={12}
              styleUrl="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            >
              {/* Monas Marker */}
              <Marker lng={106.8272} lat={-6.1751}>
                <div className="group relative">
                  <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg pulse-dot" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface border border-border p-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    National Monument (Monas)
                  </div>
                </div>
              </Marker>

              <MapOverlay position="top-right">
                <Card className="m-4 w-48 backdrop-blur-md bg-surface/80">
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-text-3 uppercase mb-2">Map Controls</h4>
                    <Stack gap="0.5rem">
                      <Button size="sm" variant="ghost" fullWidth>Filter Points</Button>
                      <Button size="sm" variant="ghost" fullWidth>Heatmap: Off</Button>
                    </Stack>
                  </div>
                </Card>
              </MapOverlay>
            </Map>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">API Reference</h2>
        <ApiTable 
          rows={[
            { name: "Map", type: "Container", description: "Main container. Requires 'center' [lng, lat] and 'zoom'." },
            { name: "Marker", type: "Component", description: "Renders any React children at specific coordinates." },
            { name: "Popup", type: "Component", description: "An anchored info window for markers or locations." },
            { name: "SuperClusterLayer", type: "Layer", description: "High-performance clustering for large datasets." },
            { name: "GeoJsonLayer", type: "Layer", description: "Standard layer for points, lines, and polygons." },
            { name: "MapOverlay", type: "Container", description: "Absolute UI container that stays fixed relative to the map viewport." },
          ]}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Callout type="info" title="Clustering">
            Easily handle 10,000+ points using the <code>SuperClusterLayer</code>. 
            It automatically groups nearby points into clusters as you zoom out.
          </Callout>
          <Callout type="info" title="Real-time Tracking">
            Use the <code>useRealtimeLocation</code> hook to smoothly animate markers 
            as they move across the map (e.g. for fleet tracking).
          </Callout>
        </div>
      </section>
    </div>
  );
};
