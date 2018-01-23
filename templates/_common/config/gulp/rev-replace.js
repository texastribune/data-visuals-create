const gulp = require('gulp');
const revReplace = require('gulp-rev-replace');

module.exports = () => {
  const manifest = gulp.src('./dist/rev-manifest.json');

  return gulp
    .src('./dist/**/*.{css,html}')
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest('./dist'));
};
