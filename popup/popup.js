const detectVideoButton =
  document.getElementById("detectVideo");

const statusElement =
  document.getElementById("status");

const durationElement =
  document.getElementById("duration");

const currentTimeElement =
  document.getElementById("currentTime");


detectVideoButton.addEventListener("click", async () => {

  try {

    statusElement.textContent = "Detecting...";

    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const tab = tabs[0];

    if (!tab || !tab.id) {
      statusElement.textContent = "No active tab";
      return;
    }

    if (!tab.url || !tab.url.includes("youtube.com")) {

      statusElement.textContent =
        "Open a YouTube video first.";

      return;
    }

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "GET_VIDEO_INFO"
      },
      (response) => {

        if (chrome.runtime.lastError) {

          console.error(
            chrome.runtime.lastError.message
          );

          statusElement.textContent =
            "Could not connect to YouTube.";

          return;
        }

        if (!response || !response.success) {

          statusElement.textContent =
            "Video not found.";

          return;
        }

        statusElement.textContent =
          "Video detected";

        durationElement.textContent =
          formatTime(response.duration);

        currentTimeElement.textContent =
          formatTime(response.currentTime);
      }
    );

  } catch (error) {

    console.error(error);

    statusElement.textContent =
      "Something went wrong.";
  }
});


function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "--";
  }

  seconds = Math.floor(seconds);

  const hours =
    Math.floor(seconds / 3600);

  const minutes =
    Math.floor((seconds % 3600) / 60);

  const secs =
    seconds % 60;

  if (hours > 0) {

    return `${String(hours).padStart(2, "0")}:` +
           `${String(minutes).padStart(2, "0")}:` +
           `${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:` +
         `${String(secs).padStart(2, "0")}`;
}


const startRecordingButton =
  document.getElementById("startRecording");

const stopRecordingButton =
  document.getElementById("stopRecording");


startRecordingButton.addEventListener(
  "click",
  async () => {

    try {

      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

      const recordedChunks = [];

      const mediaRecorder =
        new MediaRecorder(stream, {
          mimeType: "video/webm"
        });

      mediaRecorder.ondataavailable =
        (event) => {

          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }

        };


      mediaRecorder.onstop = () => {

        const blob = new Blob(
          recordedChunks,
          {
            type: "video/webm"
          }
        );

        const url =
          URL.createObjectURL(blob);

        const a =
          document.createElement("a");

        a.href = url;

        a.download =
          "youtube-clip.webm";

        a.click();

        URL.revokeObjectURL(url);

        stream.getTracks().forEach(
          track => track.stop()
        );

        statusElement.textContent =
          "Recording downloaded";

      };


      mediaRecorder.start();

      statusElement.textContent =
        "Recording...";


      stopRecordingButton.onclick = () => {

        if (
          mediaRecorder.state !== "inactive"
        ) {

          mediaRecorder.stop();

        }

      };

    } catch (error) {

      console.error(error);

      statusElement.textContent =
        "Recording cancelled";

    }

  }
);