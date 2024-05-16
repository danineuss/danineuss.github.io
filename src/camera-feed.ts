import { Point, locate } from "../libs/jsQR/locator"
import { binarize } from "../libs/jsQR/binarizer";

var video = document.createElement("video");

function toString(point: Point): string {
  return `(${point.x}|${point.y})`;
}

function scalePoint(point: Point, scaleWidgh: number, scaleHeight: number): Point {
  let result = point;
  result.x = result.x * scaleWidgh;
  result.y = result.y * scaleHeight;
  return result;
}

document.addEventListener('DOMContentLoaded', function() {
  var canvasElement = <HTMLCanvasElement>document.getElementById("overlayCanvas");
  var canvas = canvasElement.getContext("2d");
  var sketchElement = <HTMLCanvasElement>document.getElementById("sketchPad")
  var sketch = sketchElement.getContext("2d");

  var constraints = { video: { facingMode: "environment" } }; // 'environment' for rear-facing camera
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
  });
  
  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = window.innerHeight;
        canvasElement.width = window.innerWidth;
        sketchElement.height = video.videoHeight;
        sketchElement.width = video.videoWidth;

        var start = performance.now();
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var first = performance.now() - start;
        sketch.drawImage(video, 0, 0, sketchElement.width, sketchElement.height);
        var second = performance.now() - first - start;
        
        var third = performance.now() - second - first - start;
        var imageData = sketch.getImageData(0, 0, sketchElement.width, sketchElement.height);
        const binarizedBitMatrix = binarize(imageData.data, imageData.width, imageData.height, false);
        let locations = locate(binarizedBitMatrix.binarized);
        var fourth = performance.now() - third - second - first - start;

        if (locations) {          
          let location = locations[0];
          let scaleWidth = canvasElement.width / sketchElement.width;
          let scaleHeight = canvasElement.height / sketchElement.height;
          console.log(`Location: 
            ${toString(location.topLeft)} 
            ${toString(location.topRight)} 
            ${toString(location.bottomLeft)}`);
          drawLine(scalePoint(location.topLeft, scaleWidth, scaleHeight), scalePoint(location.topRight, scaleWidth, scaleHeight), "#FF0000");
          drawLine(scalePoint(location.bottomLeft, scaleWidth, scaleHeight), scalePoint(location.topLeft, scaleWidth, scaleHeight), "#00FF00");
        }
        console.log(`${first} | ${second} | ${third} | ${fourth}`);
    }
  
    requestAnimationFrame(tick);
  }

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }
});