// packages
const autoprefixer = require('autoprefixer');
const cleancss = require('gulp-clean-css');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const sass = require('gulp-sass');
const size = require('gulp-size');

// internal
const bs = require('./browsersync');
const { isProductionEnv } = require('../env');

module.exports = () => {
  return gulp
    .src('./app/styles/*.scss')
    .pipe(
      sass({
        includePaths: ['node_modules'],
        precision: 10,
      }).on('error', sass.logError)
    )
    .pipe(postcss([postcssFlexbugsFixes, autoprefixer({ flexbox: 'no-2009' })]))
    .pipe(gulp.dest('./.tmp/styles'))
    .pipe(gulpIf(isProductionEnv, cleancss()))
    .pipe(gulpIf(isProductionEnv, gulp.dest('./dist/styles')))
    .pipe(bs.stream({ match: '**/*.css' }))
    .pipe(size({ title: 'styles' }));
};
