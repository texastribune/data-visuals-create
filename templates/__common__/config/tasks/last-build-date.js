const paths = require('../paths');
const fs = require('fs');

module.exports = async () => {
  // read config file and split it by line breaks
  let configFile = fs
    .readFileSync(`${paths.appDirectory}/project.config.js`)
    .toString()
    .split('\n');

  let lastBuildDateLine;

  // find the line with the lastBuildDate
  configFile.forEach((line, i) => {
    if (line.includes('lastBuildDate')) lastBuildDateLine = i;
  });

  // replace the old date with the new updated date
  configFile[lastBuildDateLine] = configFile[lastBuildDateLine].replace(
    /(lastBuildDate:\s)('(.*?)')/g,
    `$1'${new Date().toISOString()}'`
  );

  // write to the config file path
  fs.writeFile(
    `${paths.appDirectory}/project.config.js`,
    configFile.join('\n'),
    err => {
      if (err)
        return console.log(
          `Error while updating the lastBuildDate: ${err.message}`
        );
    }
  );
};
