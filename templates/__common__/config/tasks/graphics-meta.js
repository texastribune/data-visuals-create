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

const captureScreenshotOfElement = async (element, imagePath) => {
  try {
    await element.screenshot({ path: imagePath });
    return path.basename(imagePath);
  } catch (error) {
    console.log(`Could not take screenshot of element ${imagePath}:`, error);
  }
};

// various messages
const graphicsMetaTips = {
  missingGraphics:
    'Could not find any "graphic-" prefixed CSS classes referenced in this project.',
  missingDescription:
    "\n====\nTo add a missing description, insert {% set graphicDesc = 'Description of graphic' %} above the content block in the HTML of the graphic.\nThis is used by external tools with accessibility features.\n",
  missingTitle:
    "\n====\nTo add a missing title, insert {% set graphicTitle = 'Title of graphic' %} above the content block in the HTML of the graphic.\nThis helps identify each graphic for other platforms.\n",
  missingChrome:
    'Do you have a local version of Chrome installed? \n If so, navigate to chrome://version/ in your Chrome browser and copy the path listed for Executable Path. Then rerun this process with your path:\n\nCHROME_INSTALL_PATH="local/path/to/chrome" npm run parse.',
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

const getWarnings = status => {
  const { missingDescription, missingTitle } = graphicsMetaTips;
  const noDesc = status.map(graphic => graphic.description).includes('');
  const noTitle = status.map(graphic => graphic.title).includes('');
  if (noDesc) {
    console.log(missingDescription);
  }
  if (noTitle) {
    console.log(missingTitle);
  }
};

const parseGraphic = async (
  params = { browser: {}, filepath: '', localURL: '' }
) => {
  const { browser, filepath, localURL } = params;

  // project config info
  const { bucket, createMonth, createYear, folder, id, parserOptions } = config;

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

  // only consider HTML with graphics CSS classes
  try {
    await page.waitForSelector('[class^="graphic-"]', {
      timeout: 5000,
    });
  } catch (e) {
    return false;
  }

  // look for .graphic-title or title meta tag
  let title;
  try {
    title = await page.$eval(
      '.graphic-title, meta[name="tt-graphic-title"]',
      el => {
        if (el.hasAttribute('content')) {
          return el.getAttribute('content');
        } else {
          return el.textContent;
        }
      }
    );
  } catch {
    title = '';
  }

  // look for links
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

  // look for description meta tag
  let description;
  try {
    description = await page.$eval('meta[name="tt-graphic-description"]', el =>
      el.getAttribute('content')
    );
  } catch {
    description = '';
  }

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
    id,
    label,
    links,
    previews: {
      large: graphicPath + large,
      small: graphicPath + small,
    },
    showInAppleNews,
  };
};

module.exports = async localURL => {
  // find all html pages in project
  const pages = await glob('**/*.html', {
    absolute: true,
    cwd: './.tmp',
    recursive: true,
    ignore: ['static/index.html'],
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
          `Could not find the chrome installed at '${CHROME_INSTALL_PATH}'.\n${missingChrome}\n`
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

  // output JSON of all graphic data
  try {
    await fs.outputJson(
      `${paths.appDist}/manifest.json`,
      graphics.filter(graphic => typeof graphic.title === 'string')
    );
  } catch (err) {
    throw new Error(err);
  }

  // show debug info in terminal
  const { missingChrome, missingGraphics } = graphicsMetaTips;
  if (graphics.length > 0) {
    const completed = graphics
      .filter(graphic => typeof graphic.label === 'string')
      .map(graphic => {
        let logStr = `✓ ${graphic.label}`;
        if (graphic.description.length === 0) {
          logStr = logStr + ' | missing description';
        }
        if (graphic.title.length === 0) {
          logStr = logStr + ' | missing title';
        }
        console.log(logStr);
        return graphic;
      });
    getWarnings(completed);
    console.log(
      colors.green(`Generated metadata for ${completed.length} graphics`)
    );
  } else {
    logErrorMessage(missingGraphics);
  }

  await browser.close();
};
