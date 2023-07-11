// packages
const colors = require('ansi-colors');

// get node versions
const version = process.version;
const versionNumeric = Number(process.versions.node.split('.')[0]);

// show this error message if the node version is 16 or older
if (versionNumeric <= 17) {
  console.log(
    `\n\n${colors.bgMagenta('ERROR!')} You are using node version ${colors.bold(
      colors.red(version)
    )}.\ndata-visuals-create only supports node versions 18 or later.\nUpdate your node version by running ${colors.bold(
      colors.yellow('nvm install 18')
    )} or ${colors.bold(
      colors.yellow('nvm install node')
    )} in your command line.\n\n`
  );
}
