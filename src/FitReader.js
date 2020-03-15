/**
 * Class FitReader
 */
import BinaryFile from './BinaryFile';

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
  }

}

export default FitReader;
