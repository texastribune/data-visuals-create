// native
const path = require('path');

// packages
const fs = require('fs-extra');
const quaff = require('quaff');

// internal
const { createAPI } = require('../../project.config');
const { isProductionEnv } = require('../env');
const paths = require('../paths');

module.exports = async () => {
  // skip this all if there's no createAPI function declared in project config
  if (!createAPI) return;

  const data = await quaff(paths.appData);
  const output = createAPI(data);

  // if we get nothing meaningful back, stop here
  if (output == null) return;

  if (!Array.isArray(output)) {
    throw new Error('createAPI needs to return an array');
  }

  const dir = path.join(isProductionEnv ? paths.appDist : paths.appTmp, 'api');

  await Promise.all(
    output.map(({ key, value }) =>
      fs.outputJSON(path.format({ dir, name: key, ext: '.json' }), value)
    )
  );
};
