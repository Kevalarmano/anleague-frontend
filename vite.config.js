import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access from GitHub Codespaces or Replit
  },
  build: {
    outDir: "dist",
  },
  // important for React Router
  base: "/",
});
