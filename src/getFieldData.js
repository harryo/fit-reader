export default function getFieldData(field) {
  if (field.fieldDescription) {
    const id = `${field.fieldDescription.developer_data_index}_${field.fieldDescription.field_definition_number}`;
    const { field_name: name, units, type } = field.fieldDescription;
    return {
      id,
      name,
      units,
      type,
    };
  }
  const id = field.fieldDefinitionNumber;
  if (field.fieldDefinition) {
    const { name, units, type } = field.fieldDefinition;
    return {
      id,
      name,
      units,
      type,
    };
  }
  return { id };
}
