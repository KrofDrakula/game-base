import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "GameBase",
      fileName: "game-base",
    },
    sourcemap: true,
    target: "esnext",
    emptyOutDir: true,
    reportCompressedSize: true,
  },

  plugins: [dts({ entryRoot: "src" })],
});
