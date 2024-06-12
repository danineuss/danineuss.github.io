class CameraFeed {
  private video: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;
  private canvas: CanvasRenderingContext2D;
  private sketchElement: HTMLCanvasElement;
  private sketch: CanvasRenderingContext2D;
  private constraints = { video: { facingMode: "environment" } };

  constructor() {
    this.video = document.createElement("video");
    this.canvasElement = document.getElementById("overlayCanvas") as HTMLCanvasElement;
    this.canvas = this.canvasElement.getContext("2d")!;
    this.sketchElement = document.getElementById("sketchPad") as HTMLCanvasElement;
    this.sketch = this.sketchElement.getContext("2d")!;

    document.addEventListener('DOMContentLoaded', () => this.initializeCamera());
  }

  private initializeCamera() {
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", "true");
        this.video.play();
        requestAnimationFrame(() => this.tick());
    });
  }

  private tick() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;
      this.canvasElement.height = window.innerHeight;
      this.canvasElement.width = window.innerWidth;
      this.sketchElement.height = this.video.videoHeight;
      this.sketchElement.width = this.video.videoWidth;

      this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
      this.sketch.drawImage(this.video, 0, 0, this.sketchElement.width, this.sketchElement.height);
      const imageData = this.sketch.getImageData(0, 0, this.sketchElement.width, this.sketchElement.height);
      this.emitImageData(imageData);
    }

    requestAnimationFrame(() => this.tick());
  }

  private emitImageData(imageData: ImageData) {
    const event = new CustomEvent("camera-image-data", { detail: imageData });
    document.dispatchEvent(event);
  }
}

const cameraFeed = new CameraFeed();
export default cameraFeed;