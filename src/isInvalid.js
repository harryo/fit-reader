const INVALID_VALUES = {
  enum: 0xff,
  sint8: 0x7f,
  uint8: 0xff,
  sint16: 0x7fff,
  uint16: 0xffff,
  sint32: 0x7fffffff,
  uint32: 0xffffffff,
  float32: 0xffffffff,
  float64: 0xffffffffffffffff,
  uint8z: 0x00,
  uint16z: 0x0000,
  uint32z: 0x00000000,
  byte: 0xff,
};

function invalidByte(value) {
  return value === INVALID_VALUES.byte;
}

function isInvalid(type, value) {
  switch (type) {
    case 'string':
      return value.length === 0;
    case 'byte':
      return value.every(invalidByte);
    default:
      return value === INVALID_VALUES[type];
  }
}

export default isInvalid;
