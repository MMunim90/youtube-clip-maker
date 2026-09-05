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
let currentTimeInterval = null;

function startCurrentTimeTracking() {
  if (currentTimeInterval) {
    clearInterval(currentTimeInterval);
  }

  currentTimeInterval = setInterval(async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tabs[0]?.id) {
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "GET_VIDEO_INFO",
        },
        (response) => {
          if (chrome.runtime.lastError) {
            return;
          }

          if (!response || !response.success) {
            return;
          }

          if (response.paused) {
            return;
          }

          currentTimeElement.textContent = formatTime(response.currentTime);
        },
      );
    } catch (error) {
      console.error("Current time tracking error:", error);
    }
  }, 500);
}

function stopCurrentTimeTracking() {
  if (currentTimeInterval) {
    clearInterval(currentTimeInterval);
    currentTimeInterval = null;
  }
}

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

const startTimeInput = document.getElementById("startTime");

const endTimeInput = document.getElementById("endTime");

const setStartTimeButton = document.getElementById("setStartTime");

const setEndTimeButton = document.getElementById("setEndTime");

// Set Start Time to current YouTube time
setStartTimeButton.addEventListener("click", async () => {
  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0];

    if (!tab || !tab.id) {
      statusElement.textContent = "No active tab";
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

        const currentTime = response.currentTime;

        startTimeInput.value = formatTime(currentTime);

        startTimeInput.value = formatTime(currentTime);

        statusElement.textContent = `Start time set to ${formatTime(currentTime)}`;
      },
    );
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Could not get current time.";
  }
});

// Set End Time to current YouTube time
setEndTimeButton.addEventListener("click", async () => {
  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0];

    if (!tab || !tab.id) {
      statusElement.textContent = "No active tab";
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

        const currentTime = response.currentTime;

        endTimeInput.value = formatTime(currentTime);

        endTimeInput.value = formatTime(currentTime);

        statusElement.textContent = `End time set to ${formatTime(currentTime)}`;
      },
    );
  } catch (error) {
    console.error(error);
    statusElement.textContent = "Could not get current time.";
  }
});

startTimeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    endTimeInput.focus();
  }
});

function resetConversionProgress() {
  conversionProgress.style.display = "none";

  conversionStatus.textContent = "Converting...";

  progressBlocks.textContent = "░░░░░░░░░░░░░░░░░░░░";

  progressPercentage.textContent = "0%";
}

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

        startCurrentTimeTracking();
      },
    );
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Something went wrong.";
  }
});

// Start Recording
startRecordingButton.addEventListener("click", async () => {
  resetConversionProgress();
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

const webmDownloadInput = document.querySelector(
  'input[name="downloadType"][value="webm"]',
);

recordingTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) {
      return;
    }

    // Audio Only
    if (input.value === "audio") {
      mp4DownloadInput.disabled = true;
      mp3DownloadInput.disabled = false;
      webmDownloadInput.disabled = false;

      if (mp4DownloadInput.checked) {
        mp3DownloadInput.checked = true;
      }
    }

    // Video + Audio
    if (input.value === "video") {
      mp4DownloadInput.disabled = false;
      mp3DownloadInput.disabled = false;
      webmDownloadInput.disabled = false;
    }

    // Video Only
    if (input.value === "video-only") {
      mp4DownloadInput.disabled = false;
      mp3DownloadInput.disabled = true;
      webmDownloadInput.disabled = false;

      if (mp3DownloadInput.checked) {
        mp4DownloadInput.checked = true;
      }
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

  const safePercentage = Math.max(0, Math.min(100, Number(percentage) || 0));

  progressPercentage.textContent = `${Math.round(safePercentage)}%`;

  conversionProgressBar.style.width = `${safePercentage}%`;
}

let titleAnimationFrame = null;
let titleAnimationTimeout = null;

function updateVideoTitle(title) {
  const container = videoTitleElement.parentElement;

  // Stop previous animation
  if (titleAnimationFrame) {
    cancelAnimationFrame(titleAnimationFrame);
    titleAnimationFrame = null;
  }

  if (titleAnimationTimeout) {
    clearTimeout(titleAnimationTimeout);
    titleAnimationTimeout = null;
  }

  // Reset position
  videoTitleElement.style.transform = "translateX(0)";

  // Set title
  videoTitleElement.textContent = title;

  // Check title width after rendering
  requestAnimationFrame(() => {
    const titleWidth = videoTitleElement.scrollWidth;

    const containerWidth = container.clientWidth;

    // If title fits, don't animate
    if (titleWidth <= containerWidth) {
      return;
    }

    const distance = titleWidth - containerWidth;

    // Lower value = slower
    const speed = 30; // pixels per second

    startTitleAnimation(distance, speed);
  });
}

function startTitleAnimation(distance, speed) {
  const pauseDuration = 2500; // 2 seconds

  let startTime = null;

  function pauseAtStart() {
    titleAnimationTimeout = setTimeout(() => {
      startMoving();
    }, pauseDuration);
  }

  function startMoving() {
    startTime = null;

    function move(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = (timestamp - startTime) / 1000;

      const movedDistance = elapsed * speed;

      if (movedDistance >= distance) {
        // Reached the end
        videoTitleElement.style.transform = `translateX(-${distance}px)`;

        // Pause 2 seconds at the end
        titleAnimationTimeout = setTimeout(() => {
          // Instantly return to beginning
          videoTitleElement.style.transform = "translateX(0)";

          // Pause 2 seconds at beginning
          pauseAtStart();
        }, pauseDuration);

        return;
      }

      videoTitleElement.style.transform = `translateX(-${movedDistance}px)`;

      titleAnimationFrame = requestAnimationFrame(move);
    }

    titleAnimationFrame = requestAnimationFrame(move);
  }

  // First 2-second pause
  pauseAtStart();
}
