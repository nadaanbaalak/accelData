class Audio {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.audioBuffer = null;
  }

  loadFile(file) {
    const reader = new FileReader();

    reader.onload = async function (event) {
      await this.audioContext.resume();
      const arrayBuffer = event.target.result;
      const context = this;
      this.audioContext.decodeAudioData(
        arrayBuffer,
        function (buffer) {
          this.audioBuffer = buffer;
          this.visualize();
        }.bind(context),
        function (error) {
          console.error("Error decoding file", error);
        }
      );
    }.bind(this);

    reader.readAsArrayBuffer(file); // obtaining an ArrayBuffer required for decodeAudioData method, fires loadend event at the end
  }

  visualize() {
    const audioSource = this.audioContext.createBufferSource();
    audioSource.buffer = this.audioBuffer;

    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioSource.connect(analyser);
    analyser.connect(this.audioContext.destination);

    function draw() {
      const waveform = document.getElementById("waveform");
      if (!waveform) {
        throw new Error("Couldn't find waveform container");
      }
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      waveform.innerHTML = "";

      const canvas = document.createElement("canvas");
      canvas.width = waveform.clientWidth;
      canvas.height = waveform.clientHeight;
      const canvasContext = canvas.getContext("2d");

      canvasContext.fillStyle = "#333333";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = "#ffffff";

      canvasContext.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();

      waveform.appendChild(canvas);
    }

    draw();
    audioSource.start();
  }
}

export const audio = new Audio();
