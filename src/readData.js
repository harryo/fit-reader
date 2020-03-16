// import findKey from 'lodash/findKey';
import isInvalid from './isInvalid';
import getFieldData from './getFieldData';
import profile from './config/profile.json';
import { getType } from './config';
import { int2date } from './datetime';

const FIELD_DESCRIPTION = profile.types.mesg_num.names.field_description;
const NATIVE_MESG_NUM = profile.messages.field_description.names.native_mesg_num;
const NATIVE_FIELD_NUM = profile.messages.field_description.names.native_mesg_num.native_field_num;

function getFieldType(fldDef, obj) {
  const { fieldType, options } = fldDef;
  if (!options) {
    return fieldType;
  }
  const optionDef = options.find(
    (opt) => obj[opt.refFieldName] === opt.refFieldValue,
  );
  return optionDef ? optionDef.fieldType : fieldType;
}

function processValue(value, def, obj) {
  const { baseTypeLabel, scale, offset } = def;
  const fieldType = getFieldType(def, obj);
  if (typeof value === 'number') {
    if (scale) {
      value /= scale;
    }
    if (offset) {
      value -= offset;
    }
  }
  switch (fieldType) {
    case 'byte':
      return value.toString();
    case 'bool':
      return Boolean(value);
    case 'date_time':
    case 'local_date_time':
      return int2date(value);
    case 'semicircles':
      debugger;
      return value;
    case undefined:
    case baseTypeLabel:
      return value;
    default:
      return getType(fieldType, value);
  }
}

function readData(file, localMessageType) {
  const result = {};
  localMessageType.fieldDefinitions.forEach((def) => {
    const binValue = file.read(
      def.baseTypeLabel,
      def.size,
      !localMessageType.architecture,
    );
    if (def.fieldDescription) {
      debugger;
    }
    if (isInvalid(def.baseTypeLabel, binValue) || binValue === null) {
      return;
    }
    if (!def.fieldName) {
      result[`field_${def.fieldDefinitionNumber}`] = binValue;
      return;
    }
    result[def.fieldName] = processValue(binValue, def, result);
  });
  if (localMessageType.globalMessageNumber === FIELD_DESCRIPTION) {
    debugger;
    const nativeMessageType = fitDefinition.messages[result[NATIVE_MESG_NUM].value];
    if (result[NATIVE_FIELD_NUM] === undefined) {
      // eslint-disable-next-line no-console
      console.log(
        'Expected attribute',
        NATIVE_FIELD_NUM,
        result,
        result[NATIVE_MESG_NUM].value,
      );
    } else {
      const nativeFieldNum = result[NATIVE_FIELD_NUM].value;
      const nativeFieldType = nativeMessageType[nativeFieldNum];
      if (nativeFieldType !== undefined) {
        result[NATIVE_FIELD_NUM].value = nativeFieldType.name;
      }
    }
  }
  if (localMessageType.nDeveloperFields) {
    debugger;
    const developerResult = localMessageType.developerFieldDefinitions.reduce(
      (acc, def) => {
        const value = file.read(
          def.baseTypeLabel,
          def.size,
          !localMessageType.architecture,
        );
        const fieldData = getFieldData(def);
        const key = fieldData.id;
        if (def.baseTypeLabel !== 'string' && isNaN(value)) {
          // eslint-disable-line no-restricted-globals
          return acc;
        }
        return {
          ...acc,
          [key]: { value, type: def.baseTypeLabel },
        };
      },
      {},
    );
    Object.assign(result, developerResult);
  }
  return result;
}

export default readData;
