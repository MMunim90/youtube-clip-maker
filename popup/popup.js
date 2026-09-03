// import { loadFFmpeg } from "../dist/ffmpeg.js";
import { startRecorder, stopRecording } from "../recorder/recorder.js";

let recordingStartTime = null;
let recordingTimer = null;

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

// Initial button state
startRecordingButton.disabled = false;
stopRecordingButton.disabled = true;

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
    const downloadType = getDownloadType();

    await startRecorder({
      recordingType,
      downloadType,
      startTime,
      endTime,
      playVideo,

      onStateChange: (state) => {
        if (state === "recording") {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = false;

          startRecordingTimer();
        }

        if (state === "processing") {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = true;

          stopRecordingTimer();
        }

        if (state === "finished") {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;

          stopRecordingTimer();
        }

        if (state === "cancelled" || state === "error") {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;

          stopRecordingTimer();
        }
      },
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
  recordingStartTime = Date.now();

  recordingTimeElement.textContent = "00:00";

  recordingTimer = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);

    recordingTimeElement.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopRecordingTimer() {
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
}
