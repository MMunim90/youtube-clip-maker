import { loadFFmpeg } from "../dist/ffmpeg.js";

const testFFmpegButton = document.getElementById("testFFmpeg");

testFFmpegButton.addEventListener("click", async () => {
  try {
    console.log("Starting FFmpeg test...");

    statusElement.textContent = "Loading FFmpeg...";

    await loadFFmpeg();

    statusElement.textContent = "FFmpeg Ready";

    console.log("FFmpeg test successful.");
  } catch (error) {
    console.error("FFmpeg test failed:", error);

    statusElement.textContent = "FFmpeg Error";
  }
});

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
const durationElement = document.getElementById("duration");
const currentTimeElement = document.getElementById("currentTime");

const startRecordingButton = document.getElementById("startRecording");

const stopRecordingButton = document.getElementById("stopRecording");

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

    await startRecorder({
      recordingType,
      startTime,
      endTime,
    });
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Recording cancelled";
  }
});

// Stop Recording
stopRecordingButton.addEventListener("click", () => {
  stopRecording();
});

// Recording Type
function getRecordingType() {
  const selected = document.querySelector(
    'input[name="recordingType"]:checked',
  );

  return selected ? selected.value : "video";
}
