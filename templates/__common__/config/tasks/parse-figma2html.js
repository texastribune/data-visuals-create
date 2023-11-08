const colors = require('ansi-colors');
const fs = require('fs-extra');
const extract = require('extract-zip');

// internal
const paths = require('../paths');
const { resolve } = require('path');

// functions
const moveHtml = filename => {
  // move the .html file in the app/templates directory
  fs.renameSync(
    'workspace/' + filename + '.html',
    'app/templates/figma2html-output/' + filename + '.html'
  )
}

const moveImages = filename => {
  // move the image files in the app/assets/figma2html/FILENAME directory
  const imagesPath = 'workspace/assets/figma2html/' + filename;
  fs.readdir(imagesPath, (err, images) => {
    images.forEach(image => {
      console.log('moving ' + image + '...')
      fs.renameSync(
        imagesPath + '/' + image,
        'app/assets/figma2html/' + filename + '/' + image,
      )
    })
  })
}

const moveFiles = filename => {
  console.log('Now moving the figma2html files...')

  // check if there's app/templates/figma2html-output directory
  const templatesPath = 'app/templates/figma2html-output';
  try {
    fs.accessSync(templatesPath);
  } catch (err) {
    fs.mkdirSync(templatesPath, err => {
      if(err) {
        console.log(err)
      } else {
        console.log("created figma2html-output directory!")
      }
    })
  } finally {
    moveHtml(filename);
  }

  // check if there's app/assets/figma2html directory
  const assetsPath = 'app/assets/figma2html/';

  try {
    fs.accessSync(assetsPath);
    console.log("figma2html directory already exists!")
  } catch (err) {
    fs.mkdirSync(assetsPath, (err) => {
      if(err) {
        console.log(err)
      } else {
        console.log("created new figma2html directory!")
      }
    })
  } finally {
    // create app/assets/figma2html/FILENAME directory
    try {
      fs.accessSync(assetsPath + filename);
      console.log("app/assets/figma2html/" + filename + " already exists!")
    } catch(err) {
      fs.mkdirSync(assetsPath + filename, (err) => {
        if(err) {
          console.log(err)
        } else {
          console.log("created figma2html/FILENAME directory!")
        }
      })
    }
    moveImages(filename);
  }
}

const extractZip = async (file) => {
    // extract the zip file
    try {
      console.log('Unzipping ' + colors.magentaBright(file) + '...')
      await extract(
        resolve('workspace/' + file),
        // save the extracted zip file in the workspace directory
        { dir: resolve('workspace') }
      )
      console.log(colors.magentaBright(file) + ' Extraction completed');
    } catch(err) {
      // handle any errors
    } finally {
      // get the file name
      const filename = file.replace('.zip', '');
      // then move files
      moveFiles(filename);
    }
}

module.exports = () => {
  // check if a zip file exists in the workspace directory 
  fs.readdir('workspace', (err, files) => {
    files.forEach(file => {
      if(file.includes('assets')) {
        // remove old assets files
        fs.rmSync(file, { recursive: true, force: true });
      } else if (file.includes('.zip')) {
        // extract the zip file
        extractZip(file)
      } 
    })
  })
}
