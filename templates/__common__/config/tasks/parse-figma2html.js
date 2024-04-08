const colors = require('ansi-colors');
const fs = require('fs-extra');
const extract = require('extract-zip');

// internal
const paths = require('../paths');
const { resolve } = require('path');

// functions
const extractZip = async file => {
  console.log('Unzipping ' + colors.magentaBright(file) + '...');

  try {
    // extract the zip file
    await extract(
      resolve('workspace/figma2html-exports/' + file),
      // save the extracted zip file in the workspace directory
      { dir: resolve('workspace/figma2html-exports') }
    );

    const filename = file.replace(".zip", "")
    return (filename);

  } catch (err) {
    console.log(err)
  }
}

const makeDirectory = path => {
  try {
    fs.accessSync(path);
    return (path);
  } catch (err) {
    fs.mkdirSync(path, err => {
      if (err) {
        console.log(err);
      } else {
        console.log(`created new ${path} directory!`);
        return (path);
      }
    })
  }
}

const makeHigherDirectories = filename => {
  // check and make directries
  try {
    makeDirectory('app/templates/figma2html-output')
    makeDirectory('app/assets/figma2html/')

    return (filename);

  } catch (err) {
    console.log(err)
  } 
};

const makeLowerDirectories = filename => {
  // check and make directries
  try {
    makeDirectory('app/assets/figma2html/' + filename);

    return (filename);

  } catch (err) {
    console.log(err)
  } 
};


const moveImages = filename => {
  // move the image files in the app/assets/figma2html/FILENAME directory
  const imagesPath = 'workspace/figma2html-exports/assets/figma2html/' + filename;
  fs.readdir(imagesPath, (err, images) => {
    images.forEach((image, index) => {
      console.log('moving ' + filename + ", " + image + '...');
      fs.renameSync(
        imagesPath + '/' + image,
        'app/assets/figma2html/' + filename + '/' + image
      );
      if (index == images.length - 1) {
        return (filename);
      }
    });
  });
};

const moveHtmlFiles = filename => {
  try {
    // move the .html file in the app/templates directory
    fs.rename(
      'workspace/figma2html-exports/' + filename + '.html',
      'app/templates/figma2html-output/' + filename + '.html'
    );

    return (filename)
  } catch (err) {
    console.log(err)
  }
};

const organizeFiles = async file => {
  try {
    // extract zip file
    const extractedZip = await extractZip(file);
    // make directories
    const madeHigherDirectories = await makeHigherDirectories(extractedZip);
    const madeLowerDirectories = await makeLowerDirectories(madeHigherDirectories)
    // move images
    await moveImages(madeLowerDirectories);
    // move html files
    await moveHtmlFiles(madeLowerDirectories);

  } catch (err) {
    console.log(err)
  }
}

// main function
module.exports = async () => {
  let figma2htmlExports;
  try {
    // check if a figma2html-exports directory exists in the workspace directory
    // if so, extract zip files and move files
    figma2htmlExports = fs.readdirSync('workspace/figma2html-exports');
    figma2htmlExports.forEach(file => {
      if (file.includes('.zip')) {
        organizeFiles(file);
      }
    })
  } catch (err) {
    return null;
  }
};

