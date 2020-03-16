/**
 * readFileHeader
 * See section 3.3.1 of FIT protocol
 * @param {BinaryFile} file
 */
function readFileHeader(file) {
  const headerSize = file.readUInt8();
  if (headerSize !== 12 && headerSize !== 14) {
    throw new Error('Incorrect header size');
  }
  const protocolVersion = file.readUInt8();

  // LSB first, so littleEndian true
  const profileVersion = file.readUInt16(true);

  const dataSize = file.readUInt32(true);

  const dataType = file.readString(4);
  if (dataType !== '.FIT') {
    throw new Error("Missing 'FIT' in header");
  }

  const CRC = headerSize === 14 ? file.readUInt16(true) : undefined;

  return {
    headerSize,
    protocolVersion,
    profileVersion,
    dataSize,
    dataType,
    CRC,
  };
}

export default readFileHeader;
