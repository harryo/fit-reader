/**
 * readDefinition
 * See section 4.2.1 of FIT protocol
 * @param {BinaryFile} file
 * @param {object} devDataFields
 */

import find from 'lodash/find';
import { getType, getMessage } from './config';
import nTimes from './nTimes';
// import { getType } from '../../config/fit';
// import fitDefinition from '../../config/fit.json';

function getFieldDef(list, messages) {
  const [fieldDefinitionNumber, size, baseType] = list;
  const fieldDefinition = messages ? messages[fieldDefinitionNumber] : {};
  const baseTypeLabel = getType('fit_base_type', baseType);
  return {
    fieldDefinitionNumber,
    size,
    baseType,
    baseTypeLabel,
    ...fieldDefinition,
    id: fieldDefinitionNumber,
  };
}

function getDeveloperFieldDef(list, devDataFields) {
  const [fieldNumber, size, developerDataIndex] = list;
  const developerData = find(devDataFields.developer_data_id, {
    developer_data_index: developerDataIndex,
  });
  const fieldDescription = find(devDataFields.field_description, {
    developer_data_index: developerDataIndex,
    field_definition_number: fieldNumber,
  });
  const baseTypeLabel = fieldDescription.fit_base_type_id;
  return {
    fieldNumber,
    fieldDescription,
    size,
    developerDataIndex,
    developerData,
    baseTypeLabel,
  };
}

function readDefinition(file, devDataFields) {
  const reserved = file.readUInt8();
  const architecture = file.readUInt8();
  const globalMessageNumber = file.readUInt16(!architecture);
  const messageType = getType('mesg_num', globalMessageNumber);
  const messages = getMessage(messageType);
  const nFields = file.readUInt8();
  const fieldDefinitions = nTimes(nFields).map(() => getFieldDef(file.readBytes(3), messages));
  const size = fieldDefinitions.reduce((sum, def) => sum + def.size, 0);
  const result = {
    reserved,
    architecture,
    globalMessageNumber,
    messageType,
    nFields,
    fieldDefinitions,
    size,
  };
  if (devDataFields !== null) {
    const nDeveloperFields = file.readUInt8(8);
    const developerFieldDefinitions = nTimes(nDeveloperFields).map(() => getDeveloperFieldDef(file.readBytes(3), devDataFields));
    Object.assign(result, { nDeveloperFields, developerFieldDefinitions });
  }
  return result;
}

export default readDefinition;
