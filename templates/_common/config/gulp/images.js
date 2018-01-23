'use strict';

const gulp = require('gulp');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');

module.exports = () => {
  return gulp
    .src('./app/assets/images/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe(size({ title: 'images' }));
};
