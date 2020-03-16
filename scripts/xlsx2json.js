const fs = require('fs');
const XLSX = require('xlsx');
const { camelCase } = require('lodash');

// Read arguments
if (process.argv.length < 4) {
  throw new Error('Usage: node xlsx2json <input.xlsx> <output.json>');
}
const [inFile, outFile] = process.argv.slice(2);

// Import XLSX inFile
const workbook = XLSX.readFile(inFile);
const types = getTypes(parseSheet(workbook.Sheets.Types));
const messages = getMessages(parseSheet(workbook.Sheets.Messages));
fs.writeFileSync(outFile, JSON.stringify({ types, messages }));

function getMessages(data) {
  let currentMessage;
  let currentField;
  const result = {};
  data.forEach((row) => {
    const { messageName, fieldDef, ...rest } = row;
    if (messageName) {
      currentMessage = {
        ...rest,
        names: {},
        fields: {},
      };
      result[messageName] = currentMessage;
      return;
    }
    if (fieldDef !== undefined) {
      currentField = rest;
      currentMessage.names[row.fieldName] = fieldDef;
      currentMessage.fields[fieldDef] = currentField;
      return;
    }
    if (!row.fieldName) {
      return;
    }
    if (!currentField.options) {
      currentField.options = [];
    }
    const refFieldNames = row.refFieldName.split(/,\s*/);
    const refFieldValues = row.refFieldValue.split(/,\s*/);
    for (let i = 0; i < refFieldNames.length; i++) {
      currentField.options.push({
        ...rest,
        refFieldName: refFieldNames[i],
        refFieldValue: refFieldValues[i],
      });
    }
  });
  return result;
}

/**
 * Process Types sheet and return object with Type values
 * @param {object} data
 */
function getTypes(data) {
  let currentType;
  const result = {};
  data.forEach((row) => {
    const { typeName, value, ...rest } = row;
    if (typeName) {
      currentType = {
        ...rest,
        names: {},
        values: {},
      };
      result[typeName] = currentType;
      return;
    }
    if (currentType && value !== undefined) {
      currentType.names[row.valueName] = Number(row.value);
      currentType.values[Number(row.value)] = rest;
    }
  });
  return result;
}

/**
 * Read a sheet and return a list of objects for each row
 * @param {object} sheet
 */
function parseSheet(sheet) {
  const maxRow = Number(sheet['!ref'].match(/\d+$/)[0]);
  const header = readHeader(sheet);
  const result = [];
  for (let row = 2; row <= maxRow; row++) {
    result.push(readRow(sheet, row, header));
  }
  return result;
}

/**
 * Read the first row of a sheet and return array of column letter / fieldname { col, name}
 * @param {object} sheet
 */
function readHeader(sheet) {
  const startCode = 'A'.charCodeAt(0);
  const maxCode = sheet['!ref'].match(/:(\w)/)[1].charCodeAt(0);
  const row = 1;
  const result = [];
  for (let colCode = startCode; colCode <= maxCode; colCode++) {
    const col = String.fromCharCode(colCode);
    const cell = sheet[col + row];
    if (cell) {
      result.push({ col, name: camelCase(cell.v) });
    }
  }
  return result;
}

/**
 * Read a row from the sheet and return an object with { fieldname: value } pairs
 * @param {object} sheet
 * @param {int} row
 * @param {array} header
 */
function readRow(sheet, row, header) {
  return header.reduce((acc, field) => {
    const cell = sheet[field.col + row];
    if (cell) {
      acc[field.name] = cell.v;
    }
    return acc;
  }, {});
}
