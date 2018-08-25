// packages
const gulp = require('gulp');
const revReplace = require('gulp-rev-replace');

// internal
const paths = require('../paths');

module.exports = () => {
  const manifest = gulp.src(paths.appDistManifest);

  return gulp
    .src('./dist/**/*.{css,html}')
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest('./dist'));
};
