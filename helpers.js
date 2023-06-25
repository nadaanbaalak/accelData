export function isAudioFile(file) {
  const audioTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/ogg"]; // can add more audio MIME types as needed
  const validExtensions = [".mp3", ".wav", ".ogg"]; // can add more valid audio file extensions as needed

  // Check file type based on MIME type
  if (audioTypes.includes(file.type)) {
    return true;
  }

  // Check file type based on file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));
  if (validExtensions.includes(fileExtension)) {
    return true;
  }

  return false;
}
