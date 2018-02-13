// core
const path = require('path');

// packages
const fs = require('fs-extra');
const ora = require('ora');
const updateNotifier = require('update-notifier');

// internal
const { bold, highlight, warn } = require('./colors');
const {
  getYearAndMonth,
  gitDirectoryExists,
  gitInit,
  gitInitialCommit,
  installDependencies,
} = require('./utils');
const pkg = require('../package.json');

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 6, // 6 hours
});
notifier.notify();

/**
 * List of dot files that need to be re-dotted.
 *
 * @type {Array}
 */
const DOT_FILES = [
  'editorconfig',
  'gitattributes',
  'gitignore',
  'prettierignore',
];

/**
 * The path to the template directory within `data-visuals-create`
 *
 * @type {String}
 */
const TEMPLATES = path.resolve(__dirname, '../templates');

async function createProject(projectType, slug) {
  const yearMonth = getYearAndMonth();
  const root = `${projectType}-${slug}-${yearMonth}`;

  const commonTemplateDir = path.join(TEMPLATES, '_common');
  const projectTemplateDir = path.join(TEMPLATES, projectType);

  await fs.ensureDir(root);
  const destFileList = await fs.readdir(root);

  // Shove things down a line real quick
  console.log();

  if (destFileList.length > 0)
    return console.error(
      warn(
        `Your destination directory \`${root}\` has files in it already. Giving up. I touched nothing.`
      )
    );

  const setupSpinner = ora(
    `Copying the files needed for your ${highlight(projectType)} project...`
  ).start();

  await fs.copy(path.join(TEMPLATES, '_common'), root);
  await fs.copy(path.join(TEMPLATES, projectType), root);

  for (const dotFile of DOT_FILES) {
    await fs.move(path.join(root, dotFile), path.join(root, `.${dotFile}`));
  }

  await fs.move(
    path.join(root, '_package.json'),
    path.join(root, 'package.json')
  );

  setupSpinner.succeed();

  const gitSpinner = ora('Setting up git...').start();
  const gitWasInit = await gitInit(root);
  if (gitWasInit) {
    gitSpinner.succeed();
  } else {
    gitSpinner.warn(
      `${bold(
        'Git was not set up'
      )}. This is likely because you were already in a repo.`
    );
  }

  const installSpinner = ora('Installing dependencies with npm...').start();
  await installDependencies(root);
  installSpinner.succeed();

  if (await gitDirectoryExists(root)) {
    const initialCommitSpinner = ora('Creating initial commit...').start();
    const createdInitialCommit = await gitInitialCommit(root, pkg.version);
    if (createdInitialCommit) {
      initialCommitSpinner.succeed();
    } else {
      initialCommitSpinner.warn(warn('The initial commit failed.'));
    }
  }

  console.log(`
All right! Your project has been created at ${highlight(root)}.
  `);
}

module.exports = { createProject };
