import fs from 'fs';

function getArrayBuffer(buffer) {
  if (buffer instanceof ArrayBuffer) {
    return buffer;
  }
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) { // eslint-disable-line no-plusplus
    view[i] = buffer[i];
  }
  return ab;
}

function readFile(filename) {
  const content = fs.readFileSync(filename);
  return getArrayBuffer(content);
}

export default readFile;
