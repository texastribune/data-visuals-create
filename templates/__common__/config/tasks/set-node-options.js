// package
const fs = require('fs');

// internal
const packageJson = require('../../package.json');

// set package.json config object
packageJson.config = {};

// get node version in order to update NODE_OPTIONS environment variable
const version = Number(process.versions.node.split('.')[0]);
packageJson.config.NODE_OPTIONS =
  version <= 16 ? '' : '--openssl-legacy-provider';

// update package.json file
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));