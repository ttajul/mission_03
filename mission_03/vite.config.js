import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./frontend", // specify the root directory for the frontend
  build: {
    outDir: "../dist", // output directory for build
  },
  server: {
    open: true, // open the browser on server start
  },
});
