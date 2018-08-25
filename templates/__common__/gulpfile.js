// packages
const gulp = require('gulp');

/*
Main tasks
 */
gulp.task('images', require('./config/gulp/images'));
gulp.task('scripts', require('./config/gulp/scripts'));
gulp.task('styles', require('./config/gulp/styles'));
gulp.task('templates', require('./config/gulp/templates'));
gulp.task('serve', require('./config/gulp/serve'));

/*
Utility tasks
 */
gulp.task('clean', require('./config/gulp/clean'));
gulp.task(
  'develop',
  gulp.series('clean', gulp.parallel(['styles', 'templates'], 'serve'))
);

/*
Build tasks
 */
gulp.task('rev', require('./config/gulp/rev'));
gulp.task('rev-replace', require('./config/gulp/rev-replace'));

gulp.task(
  'build',
  gulp.series(
    'clean',
    'images',
    'styles',
    gulp.parallel('scripts', 'templates'),
    'rev',
    'rev-replace'
  )
);

gulp.task('default', gulp.task('build'));
