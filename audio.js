class Audio {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.audioBuffer = null;
  }

  loadFile(file) {
    audioContext.resume();
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      this.audioContext.decodeAudioData(
        arrayBuffer,
        function (buffer) {
          this.audioBuffer = buffer;
        },
        function (error) {
          console.error("Error decoding file", error);
        }
      );
    };

    reader.readAsArrayBuffer(file); // obtaining an ArrayBuffer required for decodeAudioData method, fires loadend event at the end
  }
}

export const audio = new Audio();
