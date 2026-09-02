let mediaRecorder = null;
let recordedChunks = [];

async function startRecording() {

  try {

    recordedChunks = [];

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

    mediaRecorder.ondataavailable = (event) => {

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

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "youtube-clip.webm";

      a.click();

      URL.revokeObjectURL(url);

      stream.getTracks().forEach(
        track => track.stop()
      );

    };

    mediaRecorder.start();

    console.log("Recording started.");

  } catch (error) {

    console.error(
      "Recording failed:",
      error
    );

  }
}


function stopRecording() {

  if (
    mediaRecorder &&
    mediaRecorder.state !== "inactive"
  ) {

    mediaRecorder.stop();

    console.log("Recording stopped.");

  }

}