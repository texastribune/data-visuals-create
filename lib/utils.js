const { exec } = require('child_process');
const util = require('util');
const execThen = util.promisify(exec);

const ora = require('ora');

async function gitDirectoryExists() {
  try {
    await execThen('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function gitInit(cwd, pkgVersion) {
  try {
    await execThen('git --version', { cwd, stdio: 'ignore' });
    if (gitDirectoryExists()) {
      return false;
    }

    await execThen('git init', { cwd, stdio: 'ignore' });
    await execThen('git add -A', { cwd, stdio: 'ignore' });
    await execThen(
      `git commit -m "Initial commit made by data-visuals-create ${pkgVersion}"`,
      {
        cwd,
        stdio: 'ignore',
      }
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function installDependencies(cwd) {
  await execThen('npm install', { cwd, stdio: 'ignore' });
}

function getYearAndMonth() {
  const date = new Date();

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);

  return `${year}-${month}`;
}

module.exports = { getYearAndMonth, gitInit, installDependencies };
