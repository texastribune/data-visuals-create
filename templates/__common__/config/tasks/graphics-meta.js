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
const { ensureSlash, logErrorMessage } = require('../utils');

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

const DESC_PLACEHOLDER = 'Description of graphic';

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

const getText = async (params = { key: '', page: {}, label: '' }) => {
  const { key, page, label } = params;
  let value = '';
  let selectorFound = true;
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
    selectorFound = false;
  }
  if (!selectorFound) {
    console.log(colors.yellow(`Missing ${key} in ${label}`));
  } else if (value.length === 0) {
    console.log(colors.yellow(`Empty ${key} in ${label}`));
  } else if (key === 'description' && value === DESC_PLACEHOLDER) {
    console.log(
      colors.yellow(`Placeholder text still used for ${key} in ${label}`)
    );
  }

  return value;
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
    folder,
    id,
    tags,
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
  const label = `${parentDir}/${name}.html`;
  const graphicPath = ensureSlash(`https://${bucket}/${folder}/${parentDir}`);

  // only consider HTML with data-graphic attribute present
  try {
    await page.waitForSelector('[data-graphic]', {
      timeout: 5000,
    });
  } catch (e) {
    return false;
  }

  // get text from page
  const context = { page, label };
  const title = await getText({ key: 'title', ...context });
  const description = await getText({ key: 'description', ...context });
  const note = await getText({ key: 'note', ...context });
  const source = await getText({ key: 'source', ...context });
  let credits = await getText({ key: 'credit', ...context });

  // create array from credits
  if (credits.length > 0) {
    // separate by commas or and
    credits = credits.replace('Credit: ', '').split(/, *| and */g);
  } else {
    credits = [];
  }

  // find all links
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
      !appleNewsIgnore.includes(parentDir) && !appleNewsIgnore.includes(label);
  }

  // all graphic data
  return {
    title,
    description,
    graphicPath,
    createMonth,
    createYear,
    credits,
    id,
    label,
    links,
    previews: {
      large: graphicPath + large,
      small: graphicPath + small,
    },
    note,
    showInAppleNews,
    source,
    tags,
  };
};

module.exports = async localURL => {
  // find all html pages in project
  const pages = await glob('**/*.html', {
    absolute: true,
    cwd: './.tmp',
    recursive: true,
  });

  // spin up headless browser using local chrome
  const browser = await puppeteer
    .launch({
      executablePath: process.env.CHROME_INSTALL_PATH || CHROME_INSTALL_PATH,
    })
    .catch(err => {
      logErrorMessage(err);
      throw new Error(
        colors.yellow(
          `Could not find the chrome installed at '${CHROME_INSTALL_PATH}'.\nDo you have a local version of Chrome installed? \n If so, navigate to chrome://version/ in your Chrome browser and copy the path listed for Executable Path. Then rerun this process with your path:\n\nCHROME_INSTALL_PATH="local/path/to/chrome" npm run parse.\n`
        )
      );
    });
  console.log(colors.cyan('Parsing graphics in a headless browser...'));

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

  // output path
  const manifest = `${paths.appDist}/manifest.json`;

  // output JSON of all graphic data
  try {
    await fs.outputJson(manifest, filtered);
  } catch (err) {
    throw new Error(err);
  }

  // print output info in terminal
  if (filtered.length > 0) {
    console.log(
      colors.green(`Generated metadata for ${filtered.length} graphic(s)`)
    );
    console.log(`✓ ${manifest}`);
  } else {
    console.log(
      colors.red(
        `Generated metadata for ${
          filtered.length
        } graphics. Could not find the data-graphic attribute in any HTML files.`
      )
    );
  }

  await browser.close();
};
