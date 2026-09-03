import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        ffmpeg: "recorder/ffmpeg.js",
      },

      preserveEntrySignatures: "strict",

      output: {
        format: "es",

        entryFileNames: "ffmpeg.js",

        chunkFileNames: "assets/[name].js",

        assetFileNames: "assets/[name][extname]",
      },
    },

    outDir: "dist",

    emptyOutDir: true,
  },

  plugins: [
    {
      name: "copy-ffmpeg-core",

      closeBundle() {
        const sourceDir = resolve("node_modules/@ffmpeg/core/dist/esm");

        const targetDir = resolve("dist/libs/ffmpeg");

        mkdirSync(targetDir, {
          recursive: true,
        });

        copyFileSync(
          resolve(sourceDir, "ffmpeg-core.js"),
          resolve(targetDir, "ffmpeg-core.js"),
        );

        copyFileSync(
          resolve(sourceDir, "ffmpeg-core.wasm"),
          resolve(targetDir, "ffmpeg-core.wasm"),
        );

        console.log("FFmpeg core files copied successfully.");
      },
    },
  ],
});
