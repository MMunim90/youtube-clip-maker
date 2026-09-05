import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { copyFileSync, cpSync, mkdirSync } from "fs";

import { resolve } from "path";

export default defineConfig({
  base: "./",

  build: {
    outDir: "dist",

    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup: "index.html",
        ffmpeg: "recorder/ffmpeg.js",
      },

      preserveEntrySignatures: "strict",

      output: {
        format: "es",

        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "ffmpeg") {
            return "ffmpeg.js";
          }

          return "assets/[name].js";
        },

        chunkFileNames: "assets/[name].js",

        assetFileNames: "assets/[name][extname]",
      },
    },
  },

  plugins: [
    react(),
    tailwindcss(),

    {
      name: "copy-static-extension-files",

      closeBundle() {
        const distDir = resolve("dist");

        /*
         * Copy manifest.json
         */
        copyFileSync(
          resolve("manifest.json"),
          resolve(distDir, "manifest.json"),
        );

        /*
         * Copy icons
         */
        cpSync(resolve("icons"), resolve(distDir, "icons"), {
          recursive: true,
        });

        /*
         * Copy content scripts
         */
        cpSync(resolve("content"), resolve(distDir, "content"), {
          recursive: true,
        });

        /*
         * Copy background scripts
         */
        cpSync(resolve("background"), resolve(distDir, "background"), {
          recursive: true,
        });

        /*
         * Copy recorder scripts
         */
        mkdirSync(resolve(distDir, "recorder"), {
          recursive: true,
        });

        copyFileSync(
          resolve("recorder/recorder.js"),
          resolve(distDir, "recorder/recorder.js"),
        );

        console.log("Static extension files copied successfully.");
      },
    },

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
