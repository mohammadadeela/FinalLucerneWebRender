import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Firebase — large, rarely changes
          if (id.includes("firebase")) return "vendor-firebase";
          // Framer Motion — large animation library
          if (id.includes("framer-motion")) return "vendor-framer";
          // Recharts + D3 — heavy, only used on admin dashboard
          if (id.includes("recharts") || id.includes("node_modules/d3-")) return "vendor-charts";
          // Radix UI + shadcn components
          if (id.includes("@radix-ui")) return "vendor-radix";
          // React core
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) return "vendor-react";
          // TanStack (query + table) + Zod + React Hook Form
          if (
            id.includes("@tanstack/") ||
            id.includes("node_modules/zod/") ||
            id.includes("react-hook-form") ||
            id.includes("@hookform/")
          ) return "vendor-data";
          // i18n
          if (id.includes("i18next") || id.includes("react-i18next")) return "vendor-i18n";
          // Stripe
          if (id.includes("@stripe/") || id.includes("node_modules/stripe/")) return "vendor-stripe";
          // Embla carousel / Swiper / react-slick
          if (id.includes("embla-carousel") || id.includes("swiper") || id.includes("react-slick")) return "vendor-carousel";
          // Admin pages — separate chunk
          if (id.includes("client/src/pages/admin/")) return "admin";
          // Remaining node_modules
          if (id.includes("node_modules/")) return "vendor-misc";
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
