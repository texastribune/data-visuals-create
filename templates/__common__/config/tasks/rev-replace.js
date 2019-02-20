// packages
const fs = require('fs-extra');
const glob = require('fast-glob');

// internal
const paths = require('../paths');

module.exports = async () => {
  const manifest = await fs.readJSON(paths.appDistManifest);
  const entries = Object.entries(manifest);

  const matches = await glob('**/*.{css,html}', {
    absolute: true,
    cwd: paths.appDist,
  });

  for (const file of matches) {
    let contents = await fs.readFile(file, 'utf8');

    for (const [unreved, reved] of entries) {
      contents = contents.split(unreved).join(reved);
    }

    await fs.outputFile(file, contents);
  }
};
