function getVideoElement() {
  return document.querySelector("video");
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message.action === "GET_VIDEO_INFO") {

      const video = getVideoElement();

      if (!video) {
        sendResponse({
          success: false,
          message: "YouTube video not found"
        });

        return;
      }

      sendResponse({
        success: true,
        duration: video.duration,
        currentTime: video.currentTime
      });
    }
  }
);