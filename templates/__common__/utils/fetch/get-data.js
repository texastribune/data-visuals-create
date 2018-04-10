'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const config = require('../../project.config');
const fetch = require('./fetch');
const htmlToArchieML = require('./html-to-archieml');
const paths = require('../../config/paths');
const sheetByRange = require('./sheet-by-range');
const xlsxToCopyText = require('./xlsx-to-copytext');

fetch(config.files, (err, data, file) => {
  if (err) throw err;

  fs.ensureDirSync(paths.appData);
  const filePath = path.join(paths.appData, `${file.name}.json`);

  const mutator =
    config.dataMutators && config.dataMutators[file.name]
      ? config.dataMutators[file.name]
      : d => d;

  if (file.type === 'doc') {
    htmlToArchieML(data, (err, d) => {
      if (err) throw err;
      fs.writeFileSync(filePath, JSON.stringify(mutator(d), null, 2));
      logDownload(file.name, file.fileId, 'magenta');
    });
  }

  if (file.type === 'sheet') {
    xlsxToCopyText(data, file.copytext, (err, d) => {
      if (err) throw err;
      fs.writeFileSync(filePath, JSON.stringify(mutator(d), null, 2));
      logDownload(file.name, file.fileId, 'cyan');
    });
  }

  if (file.type === 'gsheet') {
    sheetByRange(file.fileId, file.range, {
      majorDimension: file.majorDimension,
    }).then(d => {
      fs.writeFileSync(filePath, JSON.stringify(mutator(d), null, 2));
      logDownload(file.name, file.fileId, 'yellow');
    });
  }
});

function logDownload(fileName, fileId, color) {
  console.log(chalk[color](`Downloaded \`${fileName}\` (${fileId})`));
}
