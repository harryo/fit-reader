/**
 * Class FitReader
 */
import BinaryFile from './BinaryFile';
import readFileHeader from './readFileHeader';

class FitReader {
  constructor(buffer) {
    this.file = new BinaryFile(buffer);
    this.header = null;
    this.maxPos = undefined;
    this.lastTimestamp = undefined;
    this.globalData = [];
    this.localMessageTypeList = {};
    this.developerDataFields = {
      developer_data_id: [],
      field_description: [],
    };
  }

  parse(onProgress) {
    onProgress('testing');
    this.header = readFileHeader(this.file);
  }

}

export default FitReader;
