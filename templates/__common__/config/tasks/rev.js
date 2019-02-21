// native
const path = require('path');

// packages
const fs = require('fs-extra');
const glob = require('fast-glob');
const revFile = require('rev-file');

// internal
const paths = require('../paths');

const revDirs = [
  path.join(paths.appDist, '**/*.css'),
  path.join(paths.appDistAssets, '**/*'),
];

const relativeToDist = p => path.relative(paths.appDist, p);

module.exports = async () => {
  const matches = await glob(revDirs);

  const manifest = {};

  for (const original of matches) {
    const revPath = await revFile(original);
    await fs.move(original, revPath);

    manifest[relativeToDist(original)] = relativeToDist(revPath);
  }

  await fs.outputJSON(paths.appDistManifest, manifest, { spaces: 2 });
};
