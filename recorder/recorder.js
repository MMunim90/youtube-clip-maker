let mediaRecorder = null;
let recordingStream = null;
let recordedChunks = [];
let recordingTimer = null;

async function startRecorder({ recordingType, startTime, endTime }) {
  try {
    recordingStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
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

    mediaRecorder.onstop = () => {
      createDownload(recordingType);
    };

    mediaRecorder.start();

    updateRecordingStatus(recordingType);

    // Play YouTube video
    await playVideo();

    const duration = (endTime - startTime) * 1000;

    recordingTimer = setTimeout(() => {
      stopRecording();
    }, duration);
  } catch (error) {
    console.error(error);

    statusElement.textContent = "Recording cancelled";

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

function stopRecording() {
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

function createDownload(recordingType) {
  const blob = new Blob(recordedChunks, {
    type: recordingType === "audio" ? "audio/webm" : "video/webm",
  });

  const url = URL.createObjectURL(blob);

  const startInput = document.getElementById("startTime");

  const endInput = document.getElementById("endTime");

  const start = startInput.value.replace(":", "-");

  const end = endInput.value.replace(":", "-");

  const a = document.createElement("a");

  a.href = url;

  const prefix = recordingType === "audio" ? "youtube-audio" : "youtube-clip";

  a.download = `${prefix}-${start}-${end}.webm`;

  a.click();

  URL.revokeObjectURL(url);

  if (recordingType === "audio") {
    statusElement.textContent = "Audio downloaded";
  } else {
    statusElement.textContent = "Video downloaded";
  }
}
