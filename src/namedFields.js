import find from 'lodash/find';

function namedFields(definitions, values) {
  const result = Object.keys(values).reduce((acc, key) => {
    const def = find(definitions, { fieldDefinitionNumber: Number(key) });
    return {
      ...acc,
      [def.fieldDefinition.name]: values[key],
    };
  }, {});
  return result;
}

export default namedFields;
