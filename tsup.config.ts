import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: [
    "react", 
    "react-dom", 
    "react-router-dom", 
    "axios", 
    "zod", 
    "recharts", 
    "maplibre-gl", 
    "supercluster", 
    "xlsx",
    "@floating-ui/react",
    "framer-motion"
  ],
});
