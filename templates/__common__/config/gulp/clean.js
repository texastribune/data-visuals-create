// packages
const fs = require('fs-extra');

// internal
const paths = require('../paths');

module.exports = async () => {
  await Promise.all([paths.appDist, paths.appTmp].map(p => fs.remove(p)));
};
