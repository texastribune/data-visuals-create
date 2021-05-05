const paths = require('../paths');
const fs = require('fs');

module.exports = async () => {
  // read config file and split it by line breaks
  let configFile = fs
    .readFileSync(`${paths.appDirectory}/project.config.js`)
    .toString()
    .split('\n');

  let lastBuildTime;

  // find the line with the lastBuildTime
  configFile.forEach((line, i) => {
    if (line.includes('lastBuildTime')) lastBuildTime = i;
  });

  // replace the old date with the new updated date
  configFile[lastBuildTime] = configFile[lastBuildTime].replace(
    /(lastBuildTime:\s)('(.*?)')/g,
    `$1'${new Date().toISOString()}'`
  );

  // write to the config file path
  fs.writeFile(
    `${paths.appDirectory}/project.config.js`,
    configFile.join('\n'),
    err => {
      if (err)
        return console.log(
          `Error while updating the lastBuildTime: ${err.message}`
        );
    }
  );
};
