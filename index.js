var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var dropArea = document.getElementById("drop-area");

dropArea?.addEventListener("dragover", handleDragOver);
dropArea?.addEventListener("drop", handleFileSelectViaDrag);
dropArea.addEventListener("dragenter", handleDragEnter);
dropArea.addEventListener("dragleave", handleDragLeave);

//prevent default behaviour of playing audio on drop
window.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
  },
  false
);

window.addEventListener(
  "drop",
  function (event) {
    event.preventDefault();
  },
  false
);

function handleDragEnter(event) {
  event.preventDefault();
  dropArea.classList.add("dragover");
}

function handleDragLeave(event) {
  event.preventDefault();
  dropArea.classList.remove("dragover");
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

function handleFileSelectViaDrag(event) {
  event.preventDefault();
  dropArea.classList.remove("dragover");

  var file = event.dataTransfer.files[0];
  console.log(file);
  loadFile(file);
}

function loadFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var arrayBuffer = e.target.result;
    audioContext.decodeAudioData(
      arrayBuffer,
      function (audioBuffer) {
        audioBuffer = audioBuffer;
      },
      function (e) {
        console.error("Error decoding file", e);
      }
    );
  };

  reader.readAsArrayBuffer(file);
}
