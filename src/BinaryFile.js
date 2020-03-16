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
      for (let i = 0; i < buffer.length; ++i) {
        // eslint-disable-line no-plusplus
        view[i] = buffer[i];
      }
      return ab;
    }
    this.buffer = getArrayBuffer(content);
    this.position = 0;
    this.littleEndian = littleEndian;
  }

  /**
   * Read a number from the file, used by read function
   * @param {string} type
   * @param {int} size
   * @param {boolean} this.littleEndian
   */
  readNumber(type, size, littleEndian = this.littleEndian) {
    const view = new DataView(this.buffer, this.position, size);
    this.position += size;
    const isMultiByte = (tp) => /\d{2}/.test(tp);
    if (littleEndian === undefined && isMultiByte(type)) {
      throw new Error('Endian not defined');
    }
    switch (type) {
      case 'enum':
      case 'uint8':
      case 'uint8z':
        return view.getUint8(0);
      case 'sint8':
        return view.getInt8(0);
      case 'uint16':
      case 'uint16z':
        return view.getUint16(0, littleEndian);
      case 'sint16':
        return view.getInt16(0, littleEndian);
      case 'uint32':
      case 'uint32z':
        return view.getUint32(0, littleEndian);
      case 'sint32':
        return view.getInt32(0, littleEndian);
      case 'float32':
        return view.getFloat32(0, littleEndian).toPrecision(7);
      case 'float64':
        return view.getFloat64(0, littleEndian).toPrecision(16);
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
    const result = new Uint8Array(
      this.buffer.slice(this.position, nextPosition),
    );
    this.position = nextPosition;
    return result;
  }

  /**
   * Read string from file, use by read function
   * Strings are terminated by null character
   * @param {int} size
   */
  readString(size) {
    const bytes = Array.from(this.readBytes(size));
    const i0 = bytes.findIndex((byte) => byte === 0);
    if (i0 !== -1) {
      bytes.splice(i0);
    }
    return String.fromCharCode.apply(null, bytes);
  }

  /**
   * Read any type from the file
   * @param {string} type
   * @param {int} size
   * @param {boolean} this.littleEndian
   */
  read(type, size, littleEndian) {
    switch (type) {
      case 'string': {
        return this.readString(size);
      }
      case 'byte': {
        return this.readBytes(size);
      }
      default: {
        return this.readNumber(type, size, littleEndian);
      }
    }
  }

  /**
   * Read single 8-bit number
   */
  readUInt8() {
    return this.readNumber('uint8', 1);
  }

  /**
   * Read single 16-bit number
   */
  readUInt16(littleEndian) {
    return this.readNumber('uint16', 2, littleEndian);
  }

  /**
   * Read single 32-bit number
   */
  readUInt32(littleEndian) {
    return this.readNumber('uint32', 4, littleEndian);
  }
}

export default BinaryFile;
