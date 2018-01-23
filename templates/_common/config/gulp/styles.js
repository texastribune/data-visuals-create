'use strict';

const cleancss = require('gulp-clean-css');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const size = require('gulp-size');

const autoprefixer = require('autoprefixer');

const bs = require('./browsersync');

const NODE_ENV = process.env.NODE_ENV;

module.exports = () => {
  return gulp
    .src('./app/styles/*.scss')
    .pipe(
      sass({
        includePaths: ['node_modules'],
        precision: 10,
      }).on('error', sass.logError)
    )
    .pipe(
      postcss([autoprefixer({ browsers: ['last 2 versions', 'iOS >= 8'] })])
    )
    .pipe(gulp.dest('./.tmp/styles'))
    .pipe(gulpIf(NODE_ENV === 'production', cleancss()))
    .pipe(gulpIf(NODE_ENV === 'production', gulp.dest('./dist/styles')))
    .pipe(bs.stream({ match: '**/*.css' }))
    .pipe(size({ title: 'styles' }));
};
