// native
const path = require('path');

// packages
const colors = require('ansi-colors');
const fs = require('fs-extra');
const glob = require('fast-glob');
const puppeteer = require('puppeteer');

// internal
const paths = require('../paths');
const config = require('../../project.config');
const { ensureSlash, logErrorMessage, logMessage } = require('../utils');

// used for screenshots
const TABLET_BREAKPOINT = process.env.TABLET_BREAKPOINT || 768;
const MOBILE_BREAKPOINT = process.env.MOBILE_BREAKPOINT || 475;
const viewportOpts = size => {
  return {
    width: Number(size === 'tablet' ? TABLET_BREAKPOINT : MOBILE_BREAKPOINT),
    height: 1000,
    deviceScaleFactor: 2,
  };
};

// path where chrome is typically installed on MacOS
const CHROME_INSTALL_PATH =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TAGS_PLACEHOLDER = ['subject-politics'];

const captureScreenshotOfElement = async (element, imagePath) => {
  await fs.ensureDir(path.dirname(imagePath));
  try {
    await element.screenshot({ path: imagePath });
    return path.basename(imagePath);
  } catch (error) {
    console.log(`Could not take screenshot of element ${imagePath}:`, error);
  }
};

const createPreviews = async (params = { page: {}, outputPath: '' }) => {
  const { page, outputPath } = params;
  const body = await page.$('body');
  if (body) {
    // prevent edge-cropped screenshots
    await page.addStyleTag({
      content: 'body { padding: 10px; }',
    });
    // also hide CTAs
    await page.addStyleTag({
      content: '.button, .c-button { display: none; }',
    });
    await page.setViewport(viewportOpts('mobile'));
    const small = await captureScreenshotOfElement(
      body,
      `${outputPath}preview-small.png`
    );
    await page.setViewport(viewportOpts('tablet'));
    const large = await captureScreenshotOfElement(
      body,
      `${outputPath}preview-large.png`
    );
    return { small, large };
  } else {
    throw new Error(`Not found.`);
  }
};

const getText = async (params = { key: '', page: {} }) => {
  const { key, page } = params;
  let value = '';
  try {
    value = await page.$eval(
      `[data-${key}], meta[name="tt-graphic-${key}"]`,
      el => {
        if (el.hasAttribute('content')) {
          return el.getAttribute('content');
        } else {
          return el.textContent;
        }
      }
    );
  } catch {
    value = '';
  }

  return value;
};

const printWarnings = graphics => {
  const { tags } = config;
  const requiredKeys = ['alt-text', 'credits', 'source'];

  // default tags used
  if (JSON.stringify(tags) === JSON.stringify(TAGS_PLACEHOLDER)) {
    logMessage(`Default tags used in project.config.js`);
  }

  for (const graphic of graphics) {
    const { label } = graphic;
    // loop through keys and warn accordingly
    for (const [key, value] of Object.entries(graphic)) {
      // missing values
      if (requiredKeys.includes(key) && value.length === 0) {
        logMessage(`Empty ${key} in ${label}`, 'red');
      }
    }
  }
};

const parseGraphic = async (
  params = { browser: {}, filepath: '', localURL: '' }
) => {
  const { browser, filepath, localURL } = params;

  // project config info
  const {
    bucket,
    createMonth,
    createYear,
    lastBuildTime,
    folder,
    id,
    parserOptions,
  } = config;

  const name = path.basename(filepath, path.extname(filepath));
  const relativeDir = path.relative('./.tmp', filepath);
  const parentDir = path.parse(relativeDir).dir;
  const outputPath = path.join(paths.appDist, parentDir, '/');

  // begin puppeteer navigation
  const page = await browser.newPage();
  const url =
    parentDir === '.tmp' && name === 'index'
      ? `${localURL}`
      : `${localURL}/${parentDir}/${name}.html`;
  await page.goto(url, { waitUntil: 'load' });
  const label = path.join(parentDir, `${name}.html`);
  const projectPath = path.join(folder, parentDir);
  const projectURL = ensureSlash(`https://${bucket}/${folder}/${parentDir}`);

  // only consider HTML with data-graphic or data-feature attribute present
  try {
    await page.waitForSelector('[data-graphic], [data-feature]', {
      timeout: 5000,
    });
  } catch (e) {
    return false;
  }

  // get metadata
  const title = await getText({ key: 'title', page });
  const tags = await (await getText({ key: 'tags', page })).split(',');
  let credits = await getText({ key: 'credit', page });

  // determine type of metadata
  // assume the type is graphic unless data-feature is present
  const type = (await page.$('[data-feature]')) ? 'feature' : 'graphic';

  // ignore projects with no title
  if (title.length === 0) {
    logMessage(
      `${label} was skipped because no graphic or feature was title set.`
    );
    return false;
  }

  // create array from credits
  if (credits.length > 0) {
    // separate by commas or and
    credits = credits.split(/, *| and */g);
  } else {
    credits = [];
  }

  // find all links
  if (type == 'graphic') {
    const caption = await getText({ key: 'caption', page });
    const altText = await getText({ key: 'alt-text', page });
    const note = await getText({ key: 'note', page });
    let source = await getText({ key: 'source', page });

    // commenting this out as a hot fix in December 2022 for issue #158
    // // create array from source
    // if (source.length > 0) {
    //   // separate by commas or and
    //   source = source.split(/, *| and */g);
    // } else {
    //   source = [];
    // }

    const links = await page.$$eval('a', links =>
      links.map(link => {
        return {
          url: link.getAttribute('href'),
          text: link.textContent,
          isCTA:
            link.classList.contains('button') ||
            link.classList.contains('.c-button'),
        };
      })
    );

    // take screenshots of page
    const { small, large } = await createPreviews({
      page,
      outputPath,
    });

    //  check if appleNewsIgnore is specified
    let showInAppleNews = true;
    if (parserOptions) {
      const { appleNewsIgnore } = parserOptions;
      showInAppleNews =
        !appleNewsIgnore.includes(parentDir) &&
        !appleNewsIgnore.includes(label);
    }

    // all graphic data
    return {
      type,
      title,
      altText,
      bucket,
      projectPath,
      projectURL,
      caption,
      createMonth,
      createYear,
      credits,
      folder,
      id,
      lastBuildTime,
      label,
      links,
      note,
      previews: {
        large: projectURL + large,
        small: projectURL + small,
      },
      showInAppleNews,
      source,
      tags,
    };
  }

  if (type == 'feature') {
    // all feature data
    return {
      type,
      title,
      bucket,
      projectPath,
      projectURL,
      createMonth,
      createYear,
      credits,
      folder,
      id,
      lastBuildTime,
      label,
      tags,
    };
  }
};

module.exports = async localURL => {
  const { parserOptions } = config;

  // find all html pages in project
  const pages = await glob('**/*.html', {
    absolute: true,
    cwd: './.tmp',
    recursive: true,
    ignore: parserOptions.metadataIgnore,
  });

  // spin up headless browser using local chrome
  const browser = await puppeteer
    .launch({
      executablePath: process.env.CHROME_INSTALL_PATH || CHROME_INSTALL_PATH,
      headless: 'new',
    })
    .catch(err => {
      logErrorMessage(err);
      throw new Error(
        colors.yellow(
          `Could not find the chrome installed at '${CHROME_INSTALL_PATH}'.\nDo you have a local version of Chrome installed? \n If so, navigate to chrome://version/ in your Chrome browser and copy the path listed for Executable Path. Then rerun this process with your path:\n\nCHROME_INSTALL_PATH="local/path/to/chrome" npm run parse.\n`
        )
      );
    });
  logMessage(`Parsing graphics in a headless browser...`, 'cyan');

  // parse each HTML page
  const graphics = await Promise.all(
    pages.map(filepath =>
      parseGraphic({
        browser,
        filepath,
        localURL,
        config,
      })
    )
  );

  // filter skipped HTML files
  const filtered = graphics.filter(
    graphic => typeof graphic.title === 'string'
  );

  printWarnings(filtered);

  // output path
  const manifest = `${paths.appDist}/manifest.json`;

  // output JSON of all metadata
  try {
    await fs.outputJson(manifest, filtered);
  } catch (err) {
    throw new Error(err);
  }

  // print output info in terminal
  if (filtered.length > 0) {
    logMessage(`Generated metadata for ${filtered.length} item(s)`, 'green');
    console.log(`✔ ${manifest}`);
  } else {
    logMessage(
      `No metadata generated. Could not find the data-graphic or data-feature attribute in any HTML files.`,
      'red'
    );
  }

  await browser.close();
};
