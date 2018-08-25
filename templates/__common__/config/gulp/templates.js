// native
const path = require('path');
const url = require('url');

// packages
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const map = require('vinyl-map');
const quaff = require('quaff');
const rename = require('gulp-rename');
const size = require('gulp-size');

// internal
const { isProductionEnv } = require('../env');
const bs = require('./browsersync');
const config = require('../../project.config');
const nunjucksEnv = require('./nunjucks');
const paths = require('../paths');

const PROJECT_URL = isProductionEnv
  ? `https://${config.bucket}/${config.folder}/`
  : '/';

module.exports = () => {
  const data = quaff(paths.appData);

  const nunjuckify = map((buffer, filePath) => {
    const relPath = path.relative(paths.appSrc, filePath);

    const extName = path.extname(relPath);
    const baseName = path.basename(relPath, extName);
    const dirName =
      baseName === 'index'
        ? relPath.replace('index.html', '')
        : relPath.replace(extName, '');

    nunjucksEnv.addGlobal(
      'CURRENT_PAGE_URL',
      `${url.resolve(PROJECT_URL, dirName)}${dirName && '/'}`
    );

    return nunjucksEnv.renderString(buffer.toString(), { data });
  });

  return gulp
    .src(['./app/**/*.html', '!./app/templates/**', '!./app/scripts/**'])
    .pipe(nunjuckify)
    .pipe(
      rename(file => {
        if (file.basename !== 'index') {
          file.dirname = path.join(file.dirname, file.basename);
          file.basename = 'index';
        }
      })
    )
    .pipe(gulp.dest('./.tmp'))
    .pipe(
      gulpIf(
        isProductionEnv,
        htmlmin({
          collapseWhitespace: true,
          minifyJS: true,
        })
      )
    )
    .pipe(gulpIf(isProductionEnv, gulp.dest('./dist')))
    .pipe(bs.stream({ once: true }))
    .pipe(size({ title: 'templates', showFiles: true }));
};
