import { loadFFmpeg, ffmpeg } from "../dist/ffmpeg.js";
const statusElement = document.getElementById("status");

let mediaRecorder = null;
let recordingStream = null;
let recordedChunks = [];
let recordingTimer = null;

export async function startRecorder({
  recordingType,
  downloadType,
  startTime,
  endTime,
  playVideo,
  onStateChange,
}) {
  try {
    recordingStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // Check actual video track settings
    const videoTrack = recordingStream.getVideoTracks()[0];

    console.log("Video track settings:", videoTrack.getSettings());

    // Detect when user stops screen sharing
    videoTrack.addEventListener("ended", () => {
      console.log("Screen sharing stopped by user.");

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        stopRecording();
      }
    });

    let recorderStream = recordingStream;

    // Audio only
    if (recordingType === "audio") {
      const audioTracks = recordingStream.getAudioTracks();

      if (audioTracks.length === 0) {
        throw new Error("No audio track available");
      }

      recorderStream = new MediaStream(audioTracks);
    }

    let mimeType;

    if (recordingType === "audio") {
      mimeType = "audio/webm";
    } else {
      mimeType = "video/webm";
    }

    recordedChunks = [];

    mediaRecorder = new MediaRecorder(recorderStream, {
      mimeType: mimeType,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      try {
        if (onStateChange) {
          onStateChange("processing");
        }

        await createDownload(recordingType, downloadType);

        if (onStateChange) {
          onStateChange("finished");
        }
      } catch (error) {
        console.error("Processing failed:", error);

        statusElement.textContent = "Processing failed";

        if (onStateChange) {
          onStateChange("error");
        }
      }
    };

    mediaRecorder.start();

    updateRecordingStatus(recordingType);

    if (onStateChange) {
      onStateChange("recording");
    }

    // Play YouTube video
    await playVideo();

    const duration = (endTime - startTime) * 1000;

    recordingTimer = setTimeout(() => {
      stopRecording();
    }, duration);
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Recording cancelled";

    if (onStateChange) {
      onStateChange("cancelled");
    }

    stopRecording();
  }
}

function updateRecordingStatus(recordingType) {
  if (recordingType === "audio") {
    statusElement.textContent = "Recording audio...";
  } else {
    statusElement.textContent = "Recording video...";
  }
}

export function stopRecording() {
  // Clear timer
  if (recordingTimer) {
    clearTimeout(recordingTimer);
    recordingTimer = null;
  }

  // Stop recorder
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  // Stop stream
  if (recordingStream) {
    recordingStream.getTracks().forEach((track) => track.stop());

    recordingStream = null;
  }
}

async function createDownload(recordingType, downloadType) {
  const blob = new Blob(recordedChunks, {
    type: recordingType === "audio" ? "audio/webm" : "video/webm",
  });

  // =========================
  // Audio Only Recording
  // =========================

  if (recordingType === "audio") {
    if (downloadType === "mp4") {
      throw new Error("MP4 is not supported for Audio Only recording");
    }

    if (downloadType === "mp3") {
      statusElement.textContent = "Converting audio to MP3...";

      console.log("Starting WebM → MP3 conversion...");

      await convertAudioToMP3(blob);

      return;
    }

    if (downloadType === "webm") {
      statusElement.textContent = "Downloading WebM...";

      downloadBlob(blob, "webm", "youtube-audio");

      statusElement.textContent = "Audio downloaded as WebM";

      return;
    }
  }

  // =========================
  // Video + Audio Recording
  // =========================

  if (recordingType === "video") {
    if (downloadType === "mp4") {
      statusElement.textContent = "Converting video to MP4...";

      console.log("Starting WebM → MP4 conversion...");

      await convertVideoToMP4(blob);

      return;
    }

    if (downloadType === "mp3") {
      statusElement.textContent = "Converting audio to MP3...";

      console.log("Starting WebM → MP3 conversion...");

      await convertAudioToMP3(blob);

      return;
    }

    if (downloadType === "webm") {
      statusElement.textContent = "Downloading WebM...";

      downloadBlob(blob, "webm", "youtube-clip");

      statusElement.textContent = "Video downloaded as WebM";

      return;
    }
  }

  throw new Error("Unsupported recording/download type combination");
}

async function convertVideoToMP4(blob) {
  console.log("Loading FFmpeg...");

  await loadFFmpeg();

  console.log("FFmpeg ready.");

  const inputData = new Uint8Array(await blob.arrayBuffer());

  console.log("Writing input.webm to FFmpeg...");

  await ffmpeg.writeFile("input.webm", inputData);

  console.log("Running FFmpeg conversion...");

  await ffmpeg.exec([
    "-i",
    "input.webm",

    "-vf",
    "scale=720:-2,fps=30",

    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "28",

    "-c:a",
    "aac",

    "output.mp4",
  ]);

  console.log("FFmpeg conversion completed.");

  console.log("Checking output.mp4...");

  const files = await ffmpeg.listDir("/");

  console.log("FFmpeg files:", files);

  const outputData = await ffmpeg.readFile("output.mp4");

  console.log("output.mp4 read successfully.");

  const outputBlob = new Blob([outputData.buffer], {
    type: "video/mp4",
  });

  console.log("MP4 Blob created.");

  downloadBlob(outputBlob, "mp4", "youtube-clip");

  // Clean FFmpeg virtual filesystem
  await ffmpeg.deleteFile("input.webm");
  await ffmpeg.deleteFile("output.mp4");

  statusElement.textContent = "Video downloaded as MP4";

  console.log("Video MP4 downloaded successfully.");
}

async function convertAudioToMP3(blob) {
  console.log("Loading FFmpeg...");

  await loadFFmpeg();

  console.log("FFmpeg ready.");

  const inputData = new Uint8Array(await blob.arrayBuffer());

  console.log("Writing input.webm to FFmpeg...");

  await ffmpeg.writeFile("input.webm", inputData);

  console.log("Running WebM → MP3 conversion...");

  await ffmpeg.exec([
    "-i",
    "input.webm",

    "-vn",

    "-c:a",
    "libmp3lame",

    "-b:a",
    "192k",

    "output.mp3",
  ]);

  console.log("MP3 conversion completed.");

  const outputData = await ffmpeg.readFile("output.mp3");

  console.log("output.mp3 read successfully.");

  const outputBlob = new Blob([outputData.buffer], {
    type: "audio/mpeg",
  });

  console.log("MP3 Blob created.");

  downloadBlob(outputBlob, "mp3", "youtube-audio");

  // Clean FFmpeg virtual filesystem
  await ffmpeg.deleteFile("input.webm");
  await ffmpeg.deleteFile("output.mp3");

  statusElement.textContent = "Audio downloaded as MP3";

  console.log("MP3 downloaded successfully.");
}

function downloadBlob(blob, extension, prefix) {
  const url = URL.createObjectURL(blob);

  const startInput = document.getElementById("startTime");

  const endInput = document.getElementById("endTime");

  const start = startInput.value.replace(":", "-");

  const end = endInput.value.replace(":", "-");

  const a = document.createElement("a");

  a.href = url;

  a.download = `${prefix}-${start}-${end}.${extension}`;

  a.click();

  URL.revokeObjectURL(url);
}
