import { loadFFmpeg, ffmpeg } from "../dist/ffmpeg.js";
const statusElement = document.getElementById("status");

let mediaRecorder = null;
let recordingStream = null;
let recordedChunks = [];
let recordingTimer = null;
let stateChangeCallback = null;
let recordingEndTime = null;
let recordingEndTimestamp = null;
let ffmpegProgressListener = null;

let isCancelled = false;
let isPaused = false;
let endTime = null;

export async function startRecorder({
  recordingType,
  downloadType,
  startTime,
  endTime,
  playVideo,
  onProgress,
  onStateChange,
}) {
  stateChangeCallback = onStateChange;

  isCancelled = false;
  isPaused = false;

  recordingEndTime = endTime;

  try {
    recordingStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // Select tracks according to recording type
    if (recordingType === "audio") {
      // Audio Only
      const audioTracks = recordingStream.getAudioTracks();

      if (audioTracks.length === 0) {
        throw new Error("No audio track available");
      }

      recordingStream = new MediaStream(audioTracks);
    } else if (recordingType === "video-only") {
      // Video Only
      const videoTracks = recordingStream.getVideoTracks();

      if (videoTracks.length === 0) {
        throw new Error("No video track available");
      }

      recordingStream = new MediaStream(videoTracks);
    }

    const recordingDuration = (endTime - startTime) * 1000;

    recordingEndTimestamp = Date.now() + recordingDuration;

    // Check actual video track settings
    const videoTrack = recordingStream.getVideoTracks()[0];

    if (videoTrack) {
      console.log("Video track settings:", videoTrack.getSettings());

      // Detect when user stops screen sharing
      videoTrack.addEventListener("ended", () => {
        console.log("Screen sharing stopped by user.");

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          stopRecording();
        }
      });
    }

    let mimeType;

    if (recordingType === "audio") {
      mimeType = "audio/webm";
    } else {
      // Video + Audio OR Video Only
      mimeType = "video/webm";
    }

    recordedChunks = [];

    mediaRecorder = new MediaRecorder(recordingStream, {
      mimeType: mimeType,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      if (isCancelled) {
        console.log("Recording cancelled. Discarding recorded data.");

        recordedChunks = [];

        statusElement.textContent = "Recording cancelled";

        if (stateChangeCallback) {
          stateChangeCallback("cancelled");
        }

        return;
      }

      try {
        statusElement.textContent = "Processing...";

        if (stateChangeCallback) {
          stateChangeCallback("processing");
        }

        await createDownload(recordingType, downloadType, onProgress);

        if (stateChangeCallback) {
          stateChangeCallback("finished");
        }
      } catch (error) {
        console.error("Processing failed:", error);

        statusElement.textContent = "Processing failed";

        if (stateChangeCallback) {
          stateChangeCallback("error");
        }
      }
    };

    mediaRecorder.start();

    updateRecordingStatus(recordingType);

    if (stateChangeCallback) {
      stateChangeCallback("recording");
    }

    await playVideo();

    scheduleEndTimeStop();
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Recording cancelled";

    if (onStateChange) {
      onStateChange("cancelled");
    }

    //----

    stopRecording();
  }
}

function scheduleEndTimeStop() {
  if (recordingTimer) {
    clearTimeout(recordingTimer);
    recordingTimer = null;
  }

  const remainingTime = recordingEndTimestamp - Date.now();

  if (remainingTime <= 0) {
    stopRecording();
    return;
  }

  recordingTimer = setTimeout(() => {
    console.log("End time reached.");

    statusElement.textContent = "End time reached. Processing...";

    stopRecording();
  }, remainingTime);
}

function updateRecordingStatus(recordingType) {
  if (recordingType === "audio") {
    statusElement.textContent = "Recording audio...";
  } else {
    statusElement.textContent = "Recording video...";
  }
}

export function pauseRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    if (recordingTimer) {
      clearTimeout(recordingTimer);
      recordingTimer = null;
    }

    mediaRecorder.pause();

    isPaused = true;

    console.log("Recording paused.");

    statusElement.textContent = "Recording paused";

    if (stateChangeCallback) {
      stateChangeCallback("paused");
    }
  }
}

export function resumeRecording() {
  if (mediaRecorder && mediaRecorder.state === "paused") {
    mediaRecorder.resume();

    isPaused = false;

    console.log("Recording resumed.");

    const recordingType =
      mediaRecorder.stream.getVideoTracks().length > 0 ? "video" : "audio";

    updateRecordingStatus(recordingType);

    if (stateChangeCallback) {
      stateChangeCallback("recording");
    }

    scheduleEndTimeStop();
  }
}

export function cancelRecording() {
  console.log("Cancelling recording...");

  isCancelled = true;
  isPaused = false;

  if (recordingTimer) {
    clearTimeout(recordingTimer);
    recordingTimer = null;
  }

  recordedChunks = [];

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  if (recordingStream) {
    recordingStream.getTracks().forEach((track) => track.stop());

    recordingStream = null;
  }

  statusElement.textContent = "Recording cancelled";
}

export function stopRecording() {
  if (recordingTimer) {
    clearTimeout(recordingTimer);
    recordingTimer = null;
  }

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  if (recordingStream) {
    recordingStream.getTracks().forEach((track) => track.stop());

    recordingStream = null;
  }
}

async function createDownload(recordingType, downloadType, onProgress) {
  const blob = new Blob(recordedChunks, {
    type: recordingType === "audio" ? "audio/webm" : "video/webm",
  });

  // =========================
  // Video Only → MP3 Protection
  // =========================

  if (recordingType === "video-only" && downloadType === "mp3") {
    throw new Error("MP3 is not supported for Video Only recording");
  }

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

      await convertAudioToMP3(blob, (percentage) => {
        if (onProgress) {
          onProgress(percentage, "Converting audio to MP3...");
        }
      });

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
  // Video + Audio
  // OR
  // Video Only
  // =========================

  if (recordingType === "video" || recordingType === "video-only") {
    if (downloadType === "mp4") {
      statusElement.textContent = "Converting video to MP4...";

      console.log("Starting WebM → MP4 conversion...");

      await convertVideoToMP4(blob, (percentage) => {
        if (onProgress) {
          onProgress(percentage, "Converting video to MP4...");
        }
      });

      return;
    }

    if (downloadType === "mp3") {
      statusElement.textContent = "Converting audio to MP3...";

      console.log("Starting WebM → MP3 conversion...");

      await convertAudioToMP3(blob, (percentage) => {
        if (onProgress) {
          onProgress(percentage, "Converting video to MP3...");
        }
      });

      return;
    }

    if (downloadType === "webm") {
      statusElement.textContent = "Downloading WebM...";

      downloadBlob(
        blob,
        "webm",
        recordingType === "video-only" ? "youtube-video-only" : "youtube-clip",
      );

      statusElement.textContent = "Video downloaded as WebM";

      return;
    }
  }

  throw new Error("Unsupported recording/download type combination");
}

async function convertVideoToMP4(blob, onProgress) {
  await loadFFmpeg();

  await ffmpeg.writeFile(
    "input.webm",
    new Uint8Array(await blob.arrayBuffer()),
  );

  startFFmpegProgress(onProgress);

  try {
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

    if (onProgress) {
      onProgress(100);
    }
  } finally {
    stopFFmpegProgress();
  }

  const data = await ffmpeg.readFile("output.mp4");

  const mp4Blob = new Blob([data.buffer], {
    type: "video/mp4",
  });

  downloadBlob(mp4Blob, "mp4", "youtube-clip");
}

async function convertAudioToMP3(blob, onProgress) {
  await loadFFmpeg();

  await ffmpeg.writeFile(
    "input.webm",
    new Uint8Array(await blob.arrayBuffer()),
  );

  startFFmpegProgress(onProgress);

  try {
    await ffmpeg.exec([
      "-i",
      "input.webm",

      "-c:a",
      "libmp3lame",
      "-q:a",
      "0",

      "output.mp3",
    ]);

    if (onProgress) {
      onProgress(100);
    }
  } finally {
    stopFFmpegProgress();
  }

  const data = await ffmpeg.readFile("output.mp3");

  const mp3Blob = new Blob([data.buffer], {
    type: "audio/mpeg",
  });

  downloadBlob(mp3Blob, "mp3", "youtube-audio");
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

function startFFmpegProgress(onProgress) {
  ffmpegProgressListener = ({ progress }) => {
    const safeProgress = Math.max(0, Math.min(1, Number(progress) || 0));

    const percentage = Math.round(safeProgress * 100);

    console.log(`FFmpeg Progress: ${percentage}%`);

    if (onProgress) {
      onProgress(percentage);
    }
  };

  ffmpeg.on("progress", ffmpegProgressListener);
}

function stopFFmpegProgress() {
  if (ffmpegProgressListener) {
    ffmpeg.off("progress", ffmpegProgressListener);
    ffmpegProgressListener = null;
  }
}
