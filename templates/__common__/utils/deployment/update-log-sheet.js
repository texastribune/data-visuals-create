const { google } = require('googleapis');
const { getAuth } = require('../fetch/authorize');
const { dataType } = require('./update-readme');

// gets file link for first file of desired type
function getFileLink(files, type) {
  let desiredFile = files.find(file => file.type == type);

  if (desiredFile) {
    let desiredLink = `https://docs.google.com/${dataType(
      desiredFile.type
    )}/d/${desiredFile.fileId}`;

    return desiredLink;
  } else return '';
}

// update log of past data visuals works with project info
let updateLogSheet = async (mainPath, config) => {
  const auth = await getAuth();

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  // id of data visuals work spreadsheet
  const spreadsheetId = '13xpogQKMcA_5rHxs7TAWP4mG9KSF8t_3C4TaeHW-I1M';
  let sheetName, repoName;

  if (config.projectType === 'graphic') {
    sheetName = 'Embedded';
    repoName = `newsapps-dailies/${config.createYear}/${config.slug}-${
      config.createYear
    }-${config.createMonth}`;
  }
  if (config.projectType === 'feature') {
    sheetName = 'Feature';
    repoName = `feature-${config.slug}-${config.createYear}-${
      config.createMonth
    }`;
  }

  // pull the data out of the spreadsheet
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A1:A`,
  });

  // safety check for values in that range
  if (data.values) {
    let foundId = data.values.find(value => value[0] == config.id);
    if (foundId) {
      let index = data.values.findIndex(value => value[0] == config.id);
      // if id exists, update it
      sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!${index + 1}:${index + 1}`, // DON'T MESS WITH THESE INDICES
        valueInputOption: 'USER_ENTERED',
        resource: {
          // row of values
          values: [
            [
              config.id,
              '',
              '',
              '',
              '',
              '',
              mainPath,
              repoName,
              getFileLink(config.files, 'sheet'),
              getFileLink(config.files, 'doc'),
              '',
            ],
          ],
        },
      });
    } else {
      // if not, append to the end of the file
      sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        valueInputOption: 'USER_ENTERED',
        range: `${sheetName}!${data.values.length + 1}:${data.values.length +
          1}`, // DON'T MESS WITH THESE INDICES
        resource: {
          // row of values
          values: [
            [
              config.id,
              '',
              '',
              '',
              '',
              '',
              mainPath,
              repoName,
              getFileLink(config.files, 'sheet'),
              getFileLink(config.files, 'doc'),
              '',
            ],
          ],
        },
      });
    }
  }
};

module.exports = { updateLogSheet };
