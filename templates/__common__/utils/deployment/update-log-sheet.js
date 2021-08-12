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
  sheetName,
  metadata,
  metadataInput
) {
  // pull the data out of the spreadsheet
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A:B`,
  });

  // safety check for values in that range
  if (data.values) {
    // match by ID and graphic URL
    let foundProject = data.values.find(value => {
      return value[0] == metadata.id && value[1] == metadata.graphicURL;
    });

    if (foundProject) {
      let index = data.values.findIndex(value => {
        return value[0] == metadata.id && value[1] == metadata.graphicURL;
      });

      // if id exists, update it
      sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!${index + 1}:${index + 1}`, // DON'T MESS WITH THESE INDICES
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
    const spreadsheetId = '18f3xmv1_pwgw7vPvBaX9fnDvH2FlQAuHzmB7F_LH4_I';
    let sheetName;

    // get corresponding sheet
    if (config.projectType === 'graphic') {
      sheetName = 'Embedded';
    }
    if (config.projectType === 'feature') {
      sheetName = 'Feature';
    }

    // loop through metadata JSON
    if (manifestJSON.length == 0) {
      await writeToSheet(
        sheets,
        spreadsheetId,
        sheetName,
        { id: config.id, graphicURL: mainPath },
        [[config.id, mainPath]]
      );
    } else {
      for (const metadata of manifestJSON) {
        let metadataInput = [
          [
            metadata.id,
            metadata.graphicURL,
            metadata.graphicPath,
            metadata.title,
            metadata.caption,
            metadata.description,
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
          sheetName,
          metadata,
          metadataInput
        );
      }
    }
  }
};

module.exports = { updateLogSheet };
