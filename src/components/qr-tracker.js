// import foo from '../logic';
// import jsQR from 'jsqr';
// import { locate, BitMatrix } from '../../node_modules/jsqr/dist/locator/index.d.ts';
// import { BitMatrix } from '../../node_modules/jsqr/dist/BitMatrix.d.ts';
// import { locate, BitMatrix } from "jsqr";
// import { locate, BitMatrix } from "jsqr/dist/locator/";
import { locate } from "../../libs/jsQR/locator"
import { binarize } from "../../libs/jsQR/binarizer";

AFRAME.registerComponent('qr-tracker', {
  init: function() {
    this.canvasElement = document.getElementById("overlayCanvas");
    this.canvas = this.canvasElement.getContext("2d");
  },

  tick: function() {
    var imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

    const isAllZero = !imageData.data.some(item => item !== 0);

    if (isAllZero) {
      return;
    }

    const binarizedBitMatrix = binarize(imageData.data, imageData.width, imageData.height, false);
    let locations = locate(binarizedBitMatrix.binarized);
    
    if (locations){
      
      let location = locations[0];
      console.log(`Location: ${this.toString(location.topLeft)} ${this.toString(location.topRight)} ${this.toString(location.bottomLeft)}`);
      // this.drawLine(location.topLeft, location.topRight, "#FF0000");
      // this.drawLine(location.topRight, location.bottomRight, "#FF0000");
      // this.drawLine(location.bottomRight, location.bottomLeft, "#FF0000");
      // this.drawLine(location.bottomLeft, location.topLeft, "#FF0000");
    }
    // var code = jsQR(imageData.data, imageData.width, imageData.height);

    // if (code) {
    //   console.log("code")
      
    //   var xPos = (code.location.topLeftCorner.x - imageData.width / 2) / imageData.width * 20;
    //   var yPos = (imageData.height * 0.8 - code.location.topLeftCorner.y) / imageData.height * 5;
    //   this.el.setAttribute("position", {x: xPos, y: yPos, z: -5});
    // }
    
    // requestAnimationFrame(this.tick);
  },

  toString: function(point) {
    return `(${point.x}|${point.y})`;
  },

  drawLine: function(begin, end, color) {
    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  }
});