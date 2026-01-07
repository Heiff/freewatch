import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html", // natija fayli
      open: true,                    // builddan so‘ng avtomatik ochish
      gzipSize: true,                // gzip hajmini ko‘rsatish
      brotliSize: true               // brotli hajmini ko‘rsatish
    })
  ],
});
