const { google } = require('googleapis');
const { getAuth } = require('../fetch/authorize');
const { dataType } = require('./update-readme');

// for reading the manifest file
const paths = require('../../config/paths');
const fs = require('fs');

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

// fetch latest data and write new data to sheet
async function writeToSheet(
  sheets,
  spreadsheetId,
  projectID,
  projectURL,
  metadataType,
  metadataInput
) {
  // get corresponding sheet
  let sheetName;
  if (metadataType === 'graphic') {
    sheetName = 'Embedded';
  }
  if (metadataType === 'feature') {
    sheetName = 'Feature';
  }

  // pull the data out of the spreadsheet
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A:B`,
  });

  // safety check for values in that range
  if (data.values) {
    // match by ID and graphic URL
    let foundProjectIndex = data.values.findIndex(value => {
      return value[0] == projectID && value[1] == projectURL;
    });

    if (foundProjectIndex != -1) {
      // if id exists, update it
      sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!${foundProjectIndex + 1}:${foundProjectIndex + 1}`, // DON'T MESS WITH THESE INDICES
        valueInputOption: 'USER_ENTERED',
        resource: {
          // row of values
          values: metadataInput,
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
          values: metadataInput,
        },
      });
    }
  }
}

// update log of past data visuals works with project info
let updateLogSheet = async (mainPath, config) => {
  // read manifest file, which has metadata about the project
  const manifest = fs.readFileSync(`${paths.appDist}/manifest.json`, 'utf8');

  if (manifest) {
    const manifestJSON = JSON.parse(manifest); // convert metadata to JSON object

    // set up auth to connect to Google
    const auth = await getAuth();
    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    // id of data visuals work spreadsheet
    const spreadsheetId = '1hCP5zGx8dNxk59gI9wBSFY2juJVM8OFCDY45VnNb2nI';

    // loop through metadata JSON
    if (manifestJSON.length == 0) {
      let metadataInput = [
        [
          config.id,
          mainPath,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          getFileLink(config.files, 'sheet'),
          getFileLink(config.files, 'doc'),
        ],
      ];

      await writeToSheet(
        sheets,
        spreadsheetId,
        config.id,
        mainPath,
        config.projectType,
        metadataInput
      );
    } else {
      for (const metadata of manifestJSON) {
        // find hostname
        let urlObj = new URL(metadata.graphicURL);

        // only write metadata for finished graphics published to apps
        // do not write when capybara-test is the hostname
        if (urlObj.hostname == 'apps.texastribune.org') {
          let metadataInput = [
            [
              metadata.id,
              metadata.graphicURL,
              metadata.graphicPath,
              metadata.title,
              metadata.caption,
              metadata.altText,
              `${metadata.createYear}-${metadata.createMonth}`,
              metadata.lastBuildTime,
              metadata.note,
              metadata.source,
              metadata.credits.join(', '),
              metadata.tags.join(', '),
              getFileLink(config.files, 'sheet'),
              getFileLink(config.files, 'doc'),
              metadata.previews.large,
              metadata.previews.small,
            ],
          ];

          await writeToSheet(
            sheets,
            spreadsheetId,
            metadata.id,
            metadata.graphicURL,
            metadata.type,
            metadataInput
          );
        }
      }
    }
  }
};

module.exports = { updateLogSheet };
