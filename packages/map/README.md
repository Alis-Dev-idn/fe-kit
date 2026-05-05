# @alisdev/fe-kit-map

High-performance Geospatial Visualization Layer for React and TypeScript using MapLibre GL. Part of the `@alisdev/fe-kit` monorepo.

## Features

- 🌍 **MapLibre GL**: High-performance, open-source map engine.
- 📍 **Markers & Popups**: Fully customizable React components for map entities.
- 📊 **Clustering**: High-performance marker clustering via `supercluster`.
- 🔥 **Heatmaps**: GPU-optimized density visualization.
- 🛣️ **Polyline/Routes**: Easy route and path rendering.
- 🛡️ **Geofencing**: Detection of entities entering or leaving defined areas.
- 🎨 **Overlays**: System for placing UI components on map corners.
- 🛠️ **Drawing Tools**: Interactive shape creation (points, lines, polygons).

---

## Installation

```bash
pnpm add @alisdev/fe-kit-map maplibre-gl supercluster
```

---

## Getting Started

Initialize the `MapKit` defaults (optional):

```tsx
import { MapKit } from "@alisdev/fe-kit-map";

MapKit.setup({
  defaultCenter: [106.8272, -6.1751],
  defaultZoom: 12
});
```

Basic Map usage:

```tsx
import { Map, Marker, Popup } from "@alisdev/fe-kit-map";

<Map center={[106.8, -6.2]} zoom={10}>
  <Marker lng={106.8} lat={-6.2}>
    <div className="bg-blue-500 rounded-full w-4 h-4 border-2 border-white" />
  </Marker>
</Map>
```

---

## Advanced Features

### Realtime Tracking
Smooth marker movement with interpolation:

```tsx
const { position } = useRealtimeLocation({
  enabled: true,
  stream: myLocationStream,
  smooth: true
});

<Map>
  <Marker lng={position.lng} lat={position.lat} />
</Map>
```

### Clustering
Efficiently handle thousands of points:

```tsx
<SuperClusterLayer points={myPoints} radius={50} maxZoom={16} />
```

### Map Overlays
Place UI components (filters, stats) over the map:

```tsx
<Map>
  <MapOverlay position="top-right">
    <Card className="p-4">
      <h3>Map Stats</h3>
      <p>Active Users: 1,240</p>
    </Card>
  </MapOverlay>
</Map>
```

---

## Components

| Component | Description |
| :--- | :--- |
| `Map` | Main container providing the map instance. |
| `Marker` | Renders a React component at a geo-location. |
| `Popup` | Information window anchored to coordinates. |
| `GeoJsonLayer` | Renders raw GeoJSON data (points, lines, polygons). |
| `SuperClusterLayer` | High-performance point clustering. |
| `HeatmapLayer` | GPU-optimized density maps. |
| `Route` | Convenience component for drawing polylines. |
| `Geofence` | Polygon area with enter/leave detection. |
| `MapOverlay` | Absolute container for corner UI. |
| `DrawControl` | Interactive shape drawing tools. |
| `MapStyleSwitcher` | Change base map styles dynamically. |
| `LayerControl` | Toggle visibility of map layers. |
