// native
const path = require('path');

// packages
const fs = require('fs-extra');
const gulp = require('gulp');
const rev = require('gulp-rev');

// internal
const paths = require('../paths');

module.exports = () => {
  return gulp
    .src(['./dist/**/*.css', './dist/assets/**/*'], {
      base: paths.appDist,
    })
    .pipe(rev())
    .pipe(gulp.dest(paths.appDist))
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest(paths.appDist));
};
