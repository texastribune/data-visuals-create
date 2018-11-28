// core
const { exec, spawn } = require('child_process');
const path = require('path');
const util = require('util');
const execThen = util.promisify(exec);

// packages
const fs = require('fs-extra');
const glob = require('fast-glob');

/**
 * Determine whether there is already a git directory in the supplied
 * directory. Returns true if a git directory exists.
 *
 * @param {String} cwd
 * @returns {Boolean}
 */
async function gitDirectoryExists(cwd) {
  try {
    await execThen('git rev-parse --is-inside-work-tree', {
      cwd,
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * If git is on the machine, and there's not a git directory already, this
 * calls `git init`. Returns true if it was successfully called.
 *
 * @param {String} cwd
 * @returns {Boolean}
 */
async function gitInit(cwd) {
  try {
    await execThen('git --version', { cwd, stdio: 'ignore' });
    if (await gitDirectoryExists(cwd)) {
      return false;
    }

    await execThen('git init', { cwd, stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Adds and commits all the files in the current directory. Uses the supplied
 * package version to construct the commit message. Returns true if it was
 * successful.
 *
 * @param {String} cwd
 * @param {String} pkgVersion
 * @returns {Boolean}
 */
async function gitInitialCommit(cwd, pkgVersion) {
  try {
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

/**
 * Installs Node.js dependencies using `npm install`.
 *
 * @param {String} cwd
 * @returns {void}
 */
async function installDependencies(cwd) {
  await execThen('npm install', { cwd, stdio: 'ignore' });
}

/**
 * Installs the supplied list of packages with npm.
 *
 * @param {String} cwd the current working directory
 * @param {String[]} packages a list of packages to install
 * @param {Boolean} saveDev whether or not to flag packages as devDependencies
 * @returns {Promise}
 */
function installPackages(cwd, packages = [], saveDev = false) {
  return new Promise((resolve, reject) => {
    if (packages.length < 1) return reject('Empty array of packages provided.');

    const command = 'npm';
    const args = [
      'install',
      Boolean(saveDev) && '--save-dev',
      ...packages,
    ].filter(Boolean);

    const child = spawn(command, args, { cwd, stdio: 'ignore' });

    child.on('close', code => {
      if (code !== 0) {
        return reject({ command: `${command} ${args.join(' ')}` });
      }

      resolve();
    });
  });
}

/**
 * Determines the current day, month and year.
 *
 * @returns {Object}
 */
function getDayYearAndMonth() {
  const date = new Date();

  const day = `0${date.getDate()}`.slice(-2);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);

  return { day, month, year };
}

/**
 * The tiniest template renderer. Searchs for `<<...>>`, and replaces it with
 * the provided context if available.
 *
 * @param {String} str
 * @param {Object} context
 * @returns {String}
 */
function renderTemplate(str, context) {
  return str
    .split(/\<\<|\>\>/)
    .map((t, i) => (!(i % 2) ? t : context[t]))
    .join('');
}

/**
 * Removes the underscore from a path's basename if it exists. If the file is
 * a Sass file we do nothing because that's used to signify things in the
 * language.
 *
 * @param {String} filepath
 * @returns {String}
 */
function removeUnderscore(filepath) {
  const parts = path.parse(filepath);

  // don't do this if it is a Sass file, they use underscores
  if (!['.sass', '.scss'].includes(parts.ext)) {
    parts.base = parts.base.replace(/^_/, '');
  }

  return path.format(parts);
}

/**
 * Takes a source directory, a destination directory, a list of dot files and
 * a template context and copies the source directory's file to the
 * destination directory. Any files that appear in `dot_files` will have dots
 * added, and the provided context is used to replace template variables in
 * any files that have them. Returns an array of all the outputted files.
 *
 * @param {String} srcDir
 * @param {String} destDir
 * @param {Object} context
 * @returns {String[]}
 */
async function copyDirWithTemplates(srcDir, destDir, context = {}) {
  const paths = await glob(path.join(srcDir, '**/*'), { dot: true });

  const output = [];

  for (let templatePath of paths) {
    const relPath = path.relative(srcDir, removeUnderscore(templatePath));

    const str = await fs.readFile(templatePath, 'utf8');

    const destPath = path.join(destDir, relPath);
    await fs.outputFile(destPath, renderTemplate(str, context));

    output.push(destPath);
  }

  return output;
}

function deslugify(str) {
  return str
    .replace(/(-|_)+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');
}

module.exports = {
  getDayYearAndMonth,
  gitDirectoryExists,
  gitInit,
  gitInitialCommit,
  installDependencies,
  installPackages,
  copyDirWithTemplates,
  deslugify,
};
