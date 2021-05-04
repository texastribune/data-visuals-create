const paths = require('../../config/paths');
const fs = require('fs');

const { getDayYearAndMonth } = require('../utils');

module.exports = async () => {
  const { day, month, year } = getDayYearAndMonth();

  // read config file and split it by line breaks
  let configFile = fs
    .readFileSync(`${paths.appDirectory}/project.config.js`)
    .toString()
    .split('\n');

  let updateDateLine;

  // find the line with the updatedDate
  configFile.forEach((line, i) => {
    if (line.includes('updatedDate')) updateDateLine = i;
  });

  // replace the old date with the new updated date
  configFile[updateDateLine] = configFile[updateDateLine].replace(
    /'(.*?)'/g,
    `'${year}-${month}-${day}'`
  );

  // write to the config file path
  fs.writeFile(
    `${paths.appDirectory}/project.config.js`,
    configFile.join('\n'),
    err => {
      if (err) return console.log(`Error while updating the updatedDate: ${err.message}`);
    }
  );
};
