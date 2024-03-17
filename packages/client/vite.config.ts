import * as GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import inject from "@rollup/plugin-inject";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.version": JSON.stringify("v0.0.1"),
    "process.env": JSON.stringify({ NODE_ENV: "production" }),
  },
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        GlobalPolyFill.NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      util: "util",
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({
          include: ["node_modules/tweetnacl-util/**"],
          modules: { Buffer: ["buffer", "Buffer"] },
        }),
      ],
    },
  },
});
