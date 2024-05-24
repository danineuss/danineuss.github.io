import { Point, locate } from "../libs/jsQR/locator"
import { binarize } from "../libs/jsQR/binarizer";
import jsQR from "jsqr";

var video = document.createElement("video");
var total_ms = 0;
var numberOfCountings = 0;
var average_ms = 0;

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
        var second = performance.now() - start;
        
        var third = performance.now() - start;
        var imageData = sketch.getImageData(0, 0, sketchElement.width, sketchElement.height);
        var code = jsQR(imageData.data, sketchElement.width, sketchElement.height, {
          inversionAttempts: "dontInvert",
        });
        var fourth = performance.now() - start;        
        
        if (code) {          
          let scaleWidth = canvasElement.width / sketchElement.width;
          let scaleHeight = canvasElement.height / sketchElement.height;
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58", scaleWidth, scaleHeight);
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58", scaleWidth, scaleHeight);
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58", scaleWidth, scaleHeight);
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58", scaleWidth, scaleHeight);
        }
        total_ms += fourth;
        numberOfCountings++;
        average_ms = total_ms / numberOfCountings;
        console.log(`${first} | ${second} | ${third} | ${fourth} || avg: ${average_ms.toFixed(2)}`);
    }
  
    requestAnimationFrame(tick);
  }

  function drawLine(begin: Point, end: Point, color: string, sx: number, sy: number) {
    canvas.beginPath();
    canvas.moveTo(begin.x * sx, begin.y * sy);
    canvas.lineTo(end.x * sx, end.y * sy);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }
});