// packages
const { google } = require('googleapis');

const TABLE_TYPE = 'table';
const KEY_VALUE_TYPE = 'kv';
const KEY_VALUE_RANGE = '!A:B';
const SKIP_TYPE = 'skip';

function zipObject(keys, values) {
  const result = {};

  keys.forEach((key, i) => {
    if (values) {
      result[key] = values[i];
    } else {
      result[key[0]] = key[1];
    }
  });

  return result;
}

function valuesToObject(rows) {
  const headers = rows[0];

  return rows.slice(1).map(values => zipObject(headers, values));
}

async function sheetToData({ auth, spreadsheetId }) {
  // create sheets client
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  // pull the data out of the spreadsheet
  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  // grab and prepare the properties of each sheet
  const titles = data.sheets
    .map(d => {
      // pull out two fields
      const { hidden, title } = d.properties;

      // determine whether there is a sheet type
      const [name, type = TABLE_TYPE] = title.split(':');

      let processor;
      let range;

      // skip this if the sheet is hidden, it won't matter
      if (!hidden) {
        // use the processor type to determine the processor and range
        switch (type) {
          case TABLE_TYPE:
            processor = valuesToObject;
            range = '';
            break;
          case KEY_VALUE_TYPE:
            processor = zipObject;
            range = KEY_VALUE_RANGE;
            break;
          case SKIP_TYPE:
            // it does not matter
            break;
          default:
            throw new TypeError(
              `"${type}" is not a valid processor type. Found on the sheet "${name}" in spreadsheet "${
                data.properties.title
              }" (${spreadsheetId}).`
            );
        }
      }

      return { hidden, name, processor, range, title, type };
    })
    .filter(({ hidden, type }) => !hidden && type !== SKIP_TYPE); // filter out any sheets marked as hidden or tagged with :skip

  // build range for each sheet
  const ranges = titles.map(({ title, range }) => `${title}${range}`);

  // retrieve all the values from the sheets
  const { data: batchData } = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
    majorDimension: 'ROWS',
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  });

  // prepare the results object
  const result = {};

  // loop through each title to compile its related data
  titles.forEach(({ name, processor }, i) => {
    result[name] = processor(batchData.valueRanges[i].values);
  });

  return result;
}

module.exports = { sheetToData };
