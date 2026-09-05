import { FFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = new FFmpeg();

ffmpeg.on("log", ({ message }) => {
  console.log("[FFmpeg]", message);
});

let loaded = false;

export async function loadFFmpeg() {
  if (loaded) {
    return ffmpeg;
  }

  const baseURL = chrome.runtime.getURL("libs/ffmpeg");

  const workerURL = chrome.runtime.getURL("assets/worker-BzdDEeh7.js");

  const coreURL = `${baseURL}/ffmpeg-core.js`;

  const wasmURL = `${baseURL}/ffmpeg-core.wasm`;

  console.log("Loading local FFmpeg...");

  console.log("Core URL:", coreURL);

  console.log("WASM URL:", wasmURL);

  console.log("Worker URL:", workerURL);

  await ffmpeg.load({
    classWorkerURL: workerURL,

    coreURL: coreURL,

    wasmURL: wasmURL,
  });

  loaded = true;

  console.log("Local FFmpeg loaded successfully.");

  return ffmpeg;
}

export { ffmpeg };
