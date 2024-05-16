var video = document.createElement("video");

document.addEventListener('DOMContentLoaded', function() {
  var canvasElement = document.getElementById("overlayCanvas");
  var canvas = canvasElement.getContext("2d");

  var constraints = { video: { facingMode: "environment" } }; // 'environment' for rear-facing camera
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
  });
  
  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    }
  
    // Request next frame
    requestAnimationFrame(tick);
  }
});