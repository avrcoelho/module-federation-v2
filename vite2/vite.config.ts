import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3002,
  },
  build: {
    target: "chrome89",
  },
  plugins: [
    react(),
    federation({
      name: "app2",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./button": "./src/Button.tsx",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
  ],
});
