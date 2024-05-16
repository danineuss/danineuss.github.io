// import foo from '../logic';
// import jsQR from 'jsqr';
// import { locate, BitMatrix } from '../../node_modules/jsqr/dist/locator/index.d.ts';
// import { BitMatrix } from '../../node_modules/jsqr/dist/BitMatrix.d.ts';
// import { locate, BitMatrix } from "jsqr";
// import { locate, BitMatrix } from "jsqr/dist/locator/";
import { locate } from "../../libs/jsQR/locator"
import { BitMatrix } from "../../libs/jsQR/BitMatrix";

AFRAME.registerComponent('qr-tracker', {
  init: function() {
    this.canvasElement = document.getElementById("overlayCanvas");
    this.canvas = this.canvasElement.getContext("2d");
  },

  tick: function() {
    var imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
    var bitMatrix = new BitMatrix(imageData, imageData.width);
    var location = locate(bitMatrix);
    
    if (location){
      console.log("found" + location[0].topLeft.x);
    }
    // var code = jsQR(imageData.data, imageData.width, imageData.height);

    // if (code) {
    //   console.log("code")
      
    //   var xPos = (code.location.topLeftCorner.x - imageData.width / 2) / imageData.width * 20;
    //   var yPos = (imageData.height * 0.8 - code.location.topLeftCorner.y) / imageData.height * 5;
    //   this.el.setAttribute("position", {x: xPos, y: yPos, z: -5});
    // }
    
    // requestAnimationFrame(this.tick);
  }
});