/**
 * readFileHeader
 * See section 4.1 of FIT protocol
 * @param {BinaryFile} file
 */

import getBits from './getBits';

function readRecordHeader(file) {
  const byte = file.readUInt8();
  const headerType = getBits(byte, 7) ? 'compressed timestamp' : 'normal';

  const result = { headerType, byte };

  if (headerType === 'normal') {
    result.messageType = getBits(byte, 6) ? 'definition' : 'data';
    if (result.messageType === 'definition') {
      result.developerData = getBits(byte, 5);
    }
    result.localMessageType = getBits(byte, 0, 4);
  } else {
    result.localMessageType = getBits(byte, 5, 2);
    result.timeOffset = getBits(byte, 0, 5);
  }
  return result;
}

export default readRecordHeader;
