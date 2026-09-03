function getVideoElement() {
  return document.querySelector("video");
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const video = getVideoElement();

  if (!video) {
    sendResponse({
      success: false,
      message: "YouTube video not found",
    });

    return;
  }

  if (message.action === "GET_VIDEO_INFO") {
    const video = getVideoElement();

    if (!video) {
      sendResponse({
        success: false,
      });

      return;
    }

    const titleElement = document.querySelector("h1.ytd-watch-metadata");

    const title = titleElement
      ? titleElement.textContent.trim()
      : "Unknown video";

    sendResponse({
      success: true,
      title: title,
      duration: video.duration,
      currentTime: video.currentTime,
    });

    return true;
  }

  if (message.action === "SET_VIDEO_TIME") {
    const time = Number(message.time);

    if (!Number.isFinite(time)) {
      sendResponse({
        success: false,
        message: "Invalid time",
      });

      return;
    }

    video.currentTime = time;

    sendResponse({
      success: true,

      currentTime: video.currentTime,
    });

    return;
  }

  if (message.action === "PLAY_VIDEO") {
    video
      .play()
      .then(() => {
        sendResponse({
          success: true,
        });
      })
      .catch((error) => {
        console.error(error);

        sendResponse({
          success: false,
          message: "Could not play video",
        });
      });

    return true;
  }
});
