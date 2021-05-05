// core
const path = require('path');

// packages
const fs = require('fs-extra');
const nanoid = require('nanoid/async');
const ora = require('ora');

// internal
const { bold, highlight, warn } = require('./colors');
const {
  copyDirWithTemplates,
  deslugify,
  getDayYearAndMonth,
  gitInit,
  gitInitialCommit,
  installDependencies,
  installPackages,
} = require('./utils');
const pkg = require('../package.json');

/**
 * The path to the template directory within `data-visuals-create`
 *
 * @type {String}
 */
const TEMPLATES = path.resolve(__dirname, '../templates');

/**
 * The path to the common folder within the templates directory. Every
 * project generated gets these files.
 *
 * @type {String}
 */
const COMMON_DIR = path.join(TEMPLATES, '__common__');

async function createProject(projectType, projectName) {
  // template context
  const context = {};

  // data-visuals-create version
  context.createVersion = pkg.version;

  // project type
  context.type = projectType;

  // add slug to context
  context.name = projectName;
  context.title = deslugify(projectName);

  // add current day, month and year to context
  const { day, month, year } = getDayYearAndMonth();
  context.day = day;
  context.month = month;
  context.year = year;

  // add last build time to context
  // before the first build, it's the time the project was created
  context['last-build-time'] = new Date().toISOString();

  // add unique ID
  context.id = await nanoid();

  // build root directory destination
  const rootDir = `${projectType}-${projectName}-${year}-${month}`;

  // build path to selected template directory
  const projectTemplateDir = path.join(TEMPLATES, projectType);

  // if there's no template that matches, abort
  if (!(await fs.pathExists(projectTemplateDir))) {
    return console.error(
      warn(`The \`${projectType}\` project type does not exist.`)
    );
  }

  // make sure there's a folder, so fs.readdir doesn't fail
  await fs.ensureDir(rootDir);
  // get list of files
  const destFileList = await fs.readdir(rootDir);

  // Shove things down a line real quick
  console.log();

  // if there are any files in this directory, give up and don't touch anything
  if (destFileList.length > 0) {
    return console.error(
      warn(
        `Your destination directory \`${rootDir}\` has files in it already. Giving up. I touched nothing.`
      )
    );
  }

  const setupSpinner = ora(
    `Copying the files needed for your ${highlight(projectType)} project...`
  ).start();

  // copy the project files, first from common, then the template
  await copyDirWithTemplates(COMMON_DIR, rootDir, context);
  await copyDirWithTemplates(projectTemplateDir, rootDir, context);

  setupSpinner.succeed();

  // if we can, we'll set up the git repo
  const gitSpinner = ora('Setting up git...').start();
  const gitWasInit = await gitInit(rootDir);
  if (gitWasInit) {
    gitSpinner.succeed();
  } else {
    gitSpinner.warn(
      `${bold(
        'Git was not set up'
      )}. This is likely because you were already in a repo.`
    );
  }

  // so helpful, installing things
  const installSpinner = ora('Installing dependencies with npm...').start();
  await installDependencies(rootDir);
  installSpinner.succeed();

  // if we did create the repo, let's install @zeit/git-hooks + precise-commits
  if (gitWasInit) {
    const npmInstallSpinner = ora('Installing git hooks with npm...').start();

    try {
      await installPackages(
        rootDir,
        ['@zeit/git-hooks@^0.1', 'precise-commits@^1'],
        true
      );
      npmInstallSpinner.succeed();
    } catch (e) {
      console.log(e);
      npmInstallSpinner.warn(warn('Installation of git hooks failed.'));
    }
  }

  // if we did create the repo, let's do the initial commit
  if (gitWasInit) {
    const initialCommitSpinner = ora('Creating initial commit...').start();
    const createdInitialCommit = await gitInitialCommit(rootDir, pkg.version);
    if (createdInitialCommit) {
      initialCommitSpinner.succeed();
    } else {
      initialCommitSpinner.warn(warn('The initial commit failed.'));
    }
  }

  console.log(`
All right! Your project has been created at ${highlight(rootDir)}.
  `);
}

module.exports = { createProject };
