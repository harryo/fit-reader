/**
 * Read binary file as different types
 * @param {*} content 
 * @param {*} this.littleEndian 
 */

class BinaryFile {
  constructor(content, littleEndian) {
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
    this.buffer = getArrayBuffer(content);
    this.position = 0;
    this.littleEndian = littleEndian;
  }

  checkLittleEndian() {
    if (this.littleEndian === undefined) {
      throw new Error('Endian not defined')
    }
  }

  /**
   * Read a number from the file, used by read function
   * @param {string} type 
   * @param {int} size 
   * @param {boolean} this.littleEndian 
   */
  readNumber(type, size) {
    const view = new DataView(this.buffer, this.position, size);
    this.position += size;
    switch (type) {
      case 'enum':
      case 'uint8':
      case 'uint8z':
        return view.getUint8(0);
      case 'sint8':
        return view.getInt8(0);
      case 'uint16':
      case 'uint16z':
        checkLittleEndian();
          return view.getUint16(0, this.littleEndian);
      case 'sint16':
        checkLittleEndian();
          return view.getInt16(0, this.littleEndian);
      case 'uint32':
      case 'uint32z':
        checkLittleEndian();
          return view.getUint32(0, this.littleEndian);
      case 'sint32':
        checkLittleEndian();
          return view.getInt32(0, this.littleEndian);
      case 'float32':
        checkLittleEndian();
          return view.getFloat32(0, this.littleEndian).toPrecision(7);
      case 'float64':
        checkLittleEndian();
          return view.getFloat64(0, this.littleEndian).toPrecision(16);
      default:
        throw new Error(`unknown type ${type}`);
    }
  }

  /**
   * Read a sequence of bytes from the file, used by string and read functions
   * @param {int} size 
   */
  readBytes(size) {
    const nextPosition = this.position + size;
    const result = new Uint8Array(this.buffer.slice(this.position, nextPosition));
    this.position = nextPosition;
    return result;
  };

  /**
   * Read string from file, use by read function
   * Strings are terminated by null character
   * @param {int} size 
   */
  readString(size) {
    const bytes = Array.from(this.readBytes(size));
    const i0 = bytes.findIndex(byte => byte === 0);
    if (i0 !== -1) {
      bytes.splice(i0);
    }
    return String.fromCharCode.apply(null, bytes);
  };

  /**
   * Read any type from the file
   * @param {string} type 
   * @param {int} size 
   * @param {boolean} this.littleEndian 
   */
  read(type, size) {
    switch (type) {
      case 'string': {
        return this.readString(size);
      }
      case 'byte': {
        return this.readBytes(size);
      }
      default: {
        return this.readNumber(type, size);
      }
    }
  };

  /**
   * Read single 8-bit number
   */
  readUInt8() {
    return this.read('uint8', 1);
  };

  /**
   * Read single 16-bit number
   */
  readUInt16() {
    return this.read('uint16', 2, this.littleEndian);
  };

  /**
   * Read single 32-bit number
   */
  readUInt32() {
    return this.read('uint32', 4, this.littleEndian);
  };
}

export default BinaryFile;
