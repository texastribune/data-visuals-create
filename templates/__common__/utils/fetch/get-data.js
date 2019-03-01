// native
const path = require('path');

// packages
const colors = require('ansi-colors');
const fs = require('fs-extra');

// internal
const { getAuth } = require('./authorize');
const { docToArchieML } = require('./doc-to-archieml');
const { sheetByRange } = require('./sheet-by-range');
const { sheetToData } = require('./sheet-to-data');
const config = require('../../project.config');
const paths = require('../../config/paths');

async function getData() {
  const auth = await getAuth();
  const { dataMutators, files } = config;

  for (const file of files) {
    const filepath = path.join(paths.appData, `${file.name}.json`);

    const mutator =
      dataMutators && dataMutators[file.name]
        ? dataMutators[file.name]
        : d => d;

    let data;
    let color;

    switch (file.type) {
      case 'doc':
        data = await docToArchieML({ auth, documentId: file.fileId });
        color = 'magenta';
        break;
      case 'sheet':
        data = await sheetToData({ auth, spreadsheetId: file.fileId });
        color = 'cyan';
        break;
      case 'gsheet':
        data = await sheetByRange({
          auth,
          spreadsheetId: file.fileId,
          options: file.options,
        });
        color = 'yellow';
        break;
      default:
        throw new Error(
          `No data fetching method found for type "${file.type}"`
        );
    }

    data = mutator(data);

    await fs.outputJson(filepath, data, { spaces: 2 });

    logDownload(file.name, file.fileId, color);
  }
}

function logDownload(fileName, fileId, color) {
  console.log(colors[color](`Downloaded \`${fileName}\` (${fileId})`));
}

getData().catch(console.error);
