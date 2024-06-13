AFRAME.registerComponent('cyber-funk-marker', {
  schema: { 
    markerId: {type: 'string'},
    invisibleDelay_ms: {type: 'number', default: 1000}
  },
  
  init: function() {
    this.marker = document.getElementById(this.data.markerId);
    this.initialScale = this.el.object3D.scale.clone();
    this.initialQuaternion = this.el.object3D.quaternion.clone();
    this.invisibleDelay_ms = this.data.invisibleDelay_ms;

    this.el.setAttribute('visible', false);
    
    this.marker.addEventListener('markerFound', () => this.onMarkerFound());
    this.marker.addEventListener('markerLost', () => this.onMarkerLost());
  },

  tick: function() {
    if (this.markerVisible) {
      let markerQuaternion = this.marker.object3D.quaternion.clone();
      let combinedQuaternion = markerQuaternion.multiply(this.initialQuaternion.clone());
      
      this.el.object3D.position.copy(this.marker.object3D.position);
      this.el.object3D.quaternion.copy(combinedQuaternion);
      return;
    }

    if (Date.now() - this.markerLostTimeStamp > this.invisibleDelay_ms) {
      this.el.setAttribute('visible', false);
    }
  },

  onMarkerFound: function() {
    this.markerVisible = true;
    this.el.setAttribute('visible', true);
  },

  onMarkerLost: function() {
    this.markerVisible = false;
    this.markerLostTimeStamp = Date.now();
  }
});