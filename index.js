import { audio } from "./audio.js";
import { isAudioFile } from "./helpers.js";

const dropArea = document.getElementById("drop-area");

dropArea?.addEventListener("dragover", handleDragOver);
dropArea?.addEventListener("drop", handleFileSelectViaDrag);
dropArea.addEventListener("dragenter", handleDragEnter);
dropArea.addEventListener("dragleave", handleDragLeave);

const audioInput = document.getElementById("audioFile");

audioInput.addEventListener("change", handleFileSelect);

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
  dropArea?.classList.add("dragover");
}

function handleDragLeave(event) {
  event.preventDefault();
  dropArea?.classList.remove("dragover");
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

// event handler for when audio file is selected via drag and drop
function handleFileSelectViaDrag(event) {
  event.preventDefault();
  dropArea.classList.remove("dragover");
  const file = event.dataTransfer.files[0]; // getting the dragged and dropped audio file
  if (isAudioFile(file)) {
    audio.loadFile(file);
  }
}

//event
function handleFileSelect(event) {
  event.preventDefault();
  const file = event.target.files[0];
  audio.loadFile(file);
}
