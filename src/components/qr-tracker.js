import foo from '../logic';

AFRAME.registerComponent('qr-tracker', {
  init: function() {
    // this.canvasElement = document.getElementById("overlayCanvas");
    // this.canvas = this.canvasElement.getContext("2d");

    foo();

    // console.log(jsQR);
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // var centerX = canvas.width / 2;
    // var centerY = canvas.height / 2;
    // var radius = 50;
    // this.context.beginPath();
    // this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    // this.context.fillStyle = 'red';
    // this.context.fill();
  },

  tick: function() {
    // var imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
    // var code = jsQR(imageData.data, imageData.width, imageData.height);

    // if (code) {
    //   console.log(code.data);
    // }
  }
});