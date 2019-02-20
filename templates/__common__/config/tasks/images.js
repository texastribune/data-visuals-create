// native
const path = require('path');

// packages
const fs = require('fs-extra');
const glob = require('fast-glob');
const imagemin = require('imagemin');
const gifsicle = require('imagemin-gifsicle');
const jpegtran = require('imagemin-jpegtran');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');

// internal
const { validImageExtensions } = require('../utils');
const paths = require('../paths');

// default set of plugins for imagemin
const plugins = [gifsicle(), jpegtran(), optipng(), svgo()];

// builds a glob pattern based on what's being used to exclude images from the
// "copy" task so they don't smash into each other
const imageGlobPatterns = validImageExtensions.map(ext => `**/*${ext}`);

const processImage = async filepath => {
  // read the image file
  const imageBuffer = await fs.readFile(filepath);

  // pass the image file through imagemin
  const minifiedImage = await imagemin.buffer(imageBuffer, { plugins });

  // get the path relative to its source location
  const relativePath = path.relative(paths.appAssets, filepath);

  // determine the new path relative to the destination location
  const newPath = path.join(paths.appDistAssets, relativePath);

  // output new file
  await fs.outputFile(newPath, minifiedImage);
};

module.exports = async () => {
  const files = await glob(imageGlobPatterns, {
    absolute: true,
    cwd: paths.appAssets,
  });

  return await Promise.all(files.map(processImage));
};
