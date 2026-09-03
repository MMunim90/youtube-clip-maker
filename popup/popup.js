// import { loadFFmpeg } from "../dist/ffmpeg.js";
import {
  startRecorder,
  stopRecording,
  pauseRecording,
  resumeRecording,
  cancelRecording,
} from "../recorder/recorder.js";

let recordingStartTime = null;
let recordingTimer = null;
let pausedRecordingTime = 0;

function timeToSeconds(timeString) {
  const parts = timeString.trim().split(":").map(Number);

  if (parts.length !== 2 || parts.some((value) => !Number.isFinite(value))) {
    return null;
  }

  const minutes = parts[0];
  const seconds = parts[1];

  if (minutes < 0 || seconds < 0 || seconds >= 60) {
    return null;
  }

  return minutes * 60 + seconds;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "--";
  }

  seconds = Math.floor(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return (
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`
    );
  }

  return (
    `${String(minutes).padStart(2, "0")}:` + `${String(secs).padStart(2, "0")}`
  );
}

async function setVideoTime(time) {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];

  if (!tab || !tab.id) {
    throw new Error("No active tab");
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "SET_VIDEO_TIME",
        time: time,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response || !response.success) {
          reject(new Error(response?.message || "Could not set video time"));
          return;
        }

        resolve(response);
      },
    );
  });
}

async function playVideo() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];

  if (!tab || !tab.id) {
    throw new Error("No active tab");
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "PLAY_VIDEO",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response || !response.success) {
          reject(new Error(response?.message || "Could not play video"));
          return;
        }

        resolve(response);
      },
    );
  });
}

// DOM Elements
const detectVideoButton = document.getElementById("detectVideo");
const statusElement = document.getElementById("status");
const recordingTimeElement = document.getElementById("recordingTime");
const durationElement = document.getElementById("duration");
const currentTimeElement = document.getElementById("currentTime");

const startRecordingButton = document.getElementById("startRecording");

const stopRecordingButton = document.getElementById("stopRecording");

const pauseRecordingButton = document.getElementById("pauseRecording");

const cancelRecordingButton = document.getElementById("cancelRecording");

const conversionProgress = document.getElementById("conversionProgress");

const conversionStatus = document.getElementById("conversionStatus");

const progressBlocks = document.getElementById("progressBlocks");

const progressPercentage = document.getElementById("progressPercentage");

const videoTitleElement = document.getElementById("videoTitle");

// Initial button state
startRecordingButton.disabled = false;
stopRecordingButton.disabled = true;
pauseRecordingButton.disabled = true;
cancelRecordingButton.disabled = true;

// Detect YouTube Video
detectVideoButton.addEventListener("click", async () => {
  try {
    statusElement.textContent = "Detecting...";

    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0];

    if (!tab || !tab.id) {
      statusElement.textContent = "No active tab";
      return;
    }

    if (!tab.url || !tab.url.includes("youtube.com")) {
      statusElement.textContent = "Open a YouTube video first.";
      return;
    }

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "GET_VIDEO_INFO",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);

          statusElement.textContent = "Could not connect to YouTube.";

          return;
        }

        if (!response || !response.success) {
          statusElement.textContent = "Video not found.";
          return;
        }

        statusElement.textContent = "Video detected";

        updateVideoTitle(response.title || "Unknown video");

        durationElement.textContent = formatTime(response.duration);

        currentTimeElement.textContent = formatTime(response.currentTime);
      },
    );
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Something went wrong.";
  }
});

// Start Recording
startRecordingButton.addEventListener("click", async () => {
  try {
    const startInput = document.getElementById("startTime");
    const endInput = document.getElementById("endTime");

    const startTime = timeToSeconds(startInput.value);
    const endTime = timeToSeconds(endInput.value);

    if (startTime === null) {
      statusElement.textContent = "Invalid start time";
      return;
    }

    if (endTime === null) {
      statusElement.textContent = "Invalid end time";
      return;
    }

    if (startTime >= endTime) {
      statusElement.textContent = "End time must be greater";
      return;
    }

    const durationText = durationElement.textContent;
    const videoDuration = timeToSeconds(durationText);

    if (videoDuration !== null && endTime > videoDuration) {
      statusElement.textContent = "End time exceeds duration";
      return;
    }

    statusElement.textContent = "Preparing...";

    await setVideoTime(startTime);

    statusElement.textContent = "Select YouTube tab";

    const recordingType = getRecordingType();
    const downloadType = getDownloadType();

    await startRecorder({
      recordingType,
      downloadType,
      startTime,
      endTime,
      playVideo,

      onProgress: (percentage, message) => {
        updateConversionProgress(percentage, message);
      },

      onStateChange: (state) => {
        if (state === "recording") {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = false;
          pauseRecordingButton.disabled = false;
          cancelRecordingButton.disabled = false;

          pauseRecordingButton.textContent = "Pause";

          const currentRecordingType = getRecordingType();

          statusElement.textContent =
            currentRecordingType === "audio"
              ? "Recording audio..."
              : "Recording video...";

          if (pausedRecordingTime === 0 && recordingStartTime === null) {
            startRecordingTimer();
          } else if (recordingStartTime === null) {
            resumeRecordingTimer();
          }
        }

        if (state === "paused") {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = false;
          pauseRecordingButton.disabled = false;
          cancelRecordingButton.disabled = false;

          pauseRecordingButton.textContent = "Resume";

          statusElement.textContent = "Recording paused";

          pauseRecordingTimer();
        }

        if (state === "processing") {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = true;
          pauseRecordingButton.disabled = true;
          cancelRecordingButton.disabled = true;

          stopRecordingTimer();
        }

        if (state === "finished") {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;
          pauseRecordingButton.disabled = true;
          cancelRecordingButton.disabled = true;

          pauseRecordingButton.textContent = "Pause";

          stopRecordingTimer();
        }

        if (state === "cancelled") {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;
          pauseRecordingButton.disabled = true;
          cancelRecordingButton.disabled = true;

          pauseRecordingButton.textContent = "Pause";

          statusElement.textContent = "Recording cancelled";

          stopRecordingTimer();
          recordingTimeElement.textContent = "00:00";
        }

        if (state === "error") {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;
          pauseRecordingButton.disabled = true;
          cancelRecordingButton.disabled = true;

          pauseRecordingButton.textContent = "Pause";

          stopRecordingTimer();
        }
      },
    });
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Recording cancelled";
  }
});

// Cancel recording
cancelRecordingButton.addEventListener("click", () => {
  cancelRecording();
});

// Stop Recording
stopRecordingButton.addEventListener("click", () => {
  stopRecording();
});

// Pause recording
pauseRecordingButton.addEventListener("click", () => {
  if (pauseRecordingButton.textContent === "Pause") {
    pauseRecording();
  } else {
    resumeRecording();
  }
});

// Recording Type
function getRecordingType() {
  const selected = document.querySelector(
    'input[name="recordingType"]:checked',
  );

  return selected ? selected.value : "video";
}

// Download Type
function getDownloadType() {
  const selected = document.querySelector('input[name="downloadType"]:checked');

  return selected ? selected.value : "mp4";
}

const recordingTypeInputs = document.querySelectorAll(
  'input[name="recordingType"]',
);

const mp4DownloadInput = document.querySelector(
  'input[name="downloadType"][value="mp4"]',
);

const mp3DownloadInput = document.querySelector(
  'input[name="downloadType"][value="mp3"]',
);

recordingTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.value === "audio" && input.checked) {
      // Disable MP4 for Audio Only
      mp4DownloadInput.disabled = true;

      // If MP4 was selected, automatically select MP3
      if (mp4DownloadInput.checked) {
        mp3DownloadInput.checked = true;
      }
    }

    if (input.value === "video" && input.checked) {
      // Enable MP4 again
      mp4DownloadInput.disabled = false;
    }
  });
});

function startRecordingTimer() {
  pausedRecordingTime = 0;
  recordingStartTime = Date.now();

  recordingTimeElement.textContent = "00:00";

  startTimerInterval();
}

function startTimerInterval() {
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }

  recordingTimer = setInterval(() => {
    const elapsedSeconds =
      pausedRecordingTime +
      Math.floor((Date.now() - recordingStartTime) / 1000);

    recordingTimeElement.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function pauseRecordingTimer() {
  if (!recordingStartTime) {
    return;
  }

  pausedRecordingTime += Math.floor((Date.now() - recordingStartTime) / 1000);

  recordingStartTime = null;

  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }

  recordingTimeElement.textContent = formatTime(pausedRecordingTime);
}

function resumeRecordingTimer() {
  recordingStartTime = Date.now();

  startTimerInterval();
}

function stopRecordingTimer() {
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }

  recordingStartTime = null;
  pausedRecordingTime = 0;
}

function updateConversionProgress(percentage, message) {
  conversionProgress.style.display = "block";

  conversionStatus.textContent = message;

  const totalBlocks = 20;

  const filledBlocks = Math.round((percentage / 100) * totalBlocks);

  const emptyBlocks = totalBlocks - filledBlocks;

  progressBlocks.textContent =
    "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

  progressPercentage.textContent = `${percentage}%`;
}

function updateVideoTitle(title) {
  videoTitleElement.textContent = title;

  // Reset previous animation
  videoTitleElement.style.animation = "none";

  // Force browser to recalculate
  void videoTitleElement.offsetWidth;

  const container = videoTitleElement.parentElement;

  // Check if title is longer than container
  if (videoTitleElement.scrollWidth > container.clientWidth) {
    const distance = videoTitleElement.scrollWidth - container.clientWidth;

    const duration = Math.max(5, distance / 30);

    videoTitleElement.style.setProperty("--scroll-distance", `${distance}px`);

    videoTitleElement.style.setProperty("--scroll-duration", `${duration}s`);

    videoTitleElement.style.animation = `titleMarquee var(--scroll-duration) linear infinite`;
  }
}
