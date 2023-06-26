class Audio {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.audioBuffer = null;
    this.audioSource = null;
    this.gainNode = null;
    this.playbackStartTime = 0;
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
          this.setUpAudio();
          this.visualize();
        }.bind(context),
        function (error) {
          console.error("Error decoding file", error);
        }
      );
    }.bind(this);

    reader.readAsArrayBuffer(file); // obtaining an ArrayBuffer required for decodeAudioData method, fires loadend event at the end
  }

  setUpAudio() {
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.gainNode = this.audioContext.createGain();
    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    // getting the controls and enabling them
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const volumeRange = document.getElementById("volumeRange");
    playButton.disabled = true;
    pauseButton.disabled = false;
    volumeRange.disabled = false;
  }

  playAudio() {
    if (this.audioSource && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.audioSource.start(0, this.playbackStartTime); // Start from the stored start time
    this.playbackStartTime =
      this.audioContext.currentTime - this.playbackStartTime; // Update the start time
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    playButton.disabled = true;
    pauseButton.disabled = false;
  }

  pauseAudio() {
    console.log("PAUSED CLICKED", this.audioSource, this.audioContext, this);
    if (this.audioSource && this.audioContext.state === "running") {
      this.audioContext.suspend();
      this.playbackStartTime =
        this.audioContext.currentTime - this.playbackStartTime; // Store the elapsed time
      const playButton = document.getElementById("playButton");
      const pauseButton = document.getElementById("pauseButton");
      playButton.disabled = false;
      pauseButton.disabled = true;
    }
  }

  adjustVolume() {
    const volumeRange = document.getElementById("volumeRange");
    const volume = volumeRange.value;
    this.gainNode.gain.value = volume;
  }

  visualize() {
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.audioSource.connect(analyser);
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
    this.audioSource.start();
  }
}

export const audio = new Audio();
