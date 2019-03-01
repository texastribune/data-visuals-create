const { google } = require('googleapis');

async function sheetByRange({
  auth,
  spreadsheetId,
  options: { majorDimension = 'ROWS', range },
}) {
  // create sheets client
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  const { data } = await sheets.spreadsheets.values.get({
    majorDimension,
    range,
    spreadsheetId,
  });

  return data.values;
}

module.exports = { sheetByRange };
