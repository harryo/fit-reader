/**
 * Class FitReader
 */
import BinaryFile from './BinaryFile';
import readFileHeader from './readFileHeader';
import readRecordHeader from './readRecordHeader';
import readDefinition from './readDefinition';
import readData from './readData';
import { fromOffset } from './datetime';
import namedFields from './namedFields';

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
    this.header = readFileHeader(this.file);
    this.maxPos = this.header.headerSize + this.header.dataSize;
    this.definitionCounter = {};
    while (this.file.position < this.maxPos) {
      this.readRecord();
      if (onProgress) {
        onProgress(Math.floor(100 * (this.file.position / this.maxPos)));
      }
    }
  }

  getDefinitionId(definition) {
    const name = definition.messageType || `mesg_num_${definition.globalMessageNumber}`;
    const index = (this.definitionCounter[name] || 0) + 1;
    this.definitionCounter[name] = index;
    return `${name}_${index}`;
  }

  readRecord() {
    const recordHeader = readRecordHeader(this.file);
    if (recordHeader.messageType === 'definition') {
      this.readDefinition(recordHeader);
    } else {
      this.readData(recordHeader);
    }
  }

  readDefinition(recordHeader) {
    const data = readDefinition(
      this.file,
      recordHeader.developerData ? this.developerDataFields : null,
    );
    data.globalIndex = this.globalData.length;
    this.localMessageTypeList[recordHeader.localMessageType] = data;
    this.globalData.push({
      id: this.getDefinitionId(data),
      definition: data,
      data: [],
    });
  }

  readData(recordHeader) {
    const localMessageType = this.localMessageTypeList[
      recordHeader.localMessageType
    ];
    const data = readData(this.file, localMessageType);
    if (data.timestamp) {
      this.lastTimestamp = data.timestamp;
    }
    if (recordHeader.headerType === 'compressed timestamp') {
      data.timestamp = fromOffset(
        recordHeader.timeOffset,
        this.lastTimestamp.value,
      );
    }
    this.globalData[localMessageType.globalIndex].data.push(data);
    const msgType = localMessageType.messageType;
    if (this.developerDataFields[msgType]) {
      debugger;
      this.developerDataFields[msgType].push(
        namedFields(localMessageType.fieldDefinitions, data),
      );
    }
  }
}

export default FitReader;
