import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      // Make the files necessary for running the Scanbot SDK WebAssembly modules available as static files
      targets: [
        {
          src: "node_modules/scanbot-web-sdk/bundle/bin/complete/*",
          dest: "wasm",
        },
      ],
      structured: false,
    }),
  ],
});
