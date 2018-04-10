'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

/*
Main tasks
 */
gulp.task('images', require('./config/gulp/images'));
gulp.task('scripts', require('./config/gulp/scripts'));
gulp.task('styles', require('./config/gulp/styles'));
gulp.task('templates', require('./config/gulp/templates'));

/*
Utility tasks
 */
gulp.task('clean', require('./config/gulp/clean'));
gulp.task('serve', ['styles', 'templates'], require('./config/gulp/serve'));

/*
Build tasks
 */
gulp.task('rev', require('./config/gulp/rev'));
gulp.task('rev-replace', ['rev'], require('./config/gulp/rev-replace'));

gulp.task('build', ['clean'], done => {
  runSequence(
    ['images'],
    ['styles'],
    ['scripts', 'templates'],
    ['rev-replace'],
    done
  );
});

gulp.task('default', ['build']);
