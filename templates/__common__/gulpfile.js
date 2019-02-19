// packages
const gulp = require('gulp');

/*
Main tasks
 */
gulp.task('copy', require('./config/gulp/copy'));
gulp.task('images', require('./config/gulp/images'));
gulp.task('scripts', require('./config/gulp/scripts'));
gulp.task('styles', require('./config/gulp/styles'));
gulp.task('templates', require('./config/gulp/templates'));
gulp.task('serve', require('./config/gulp/serve'));
gulp.task('api', require('./config/gulp/api'));

/*
Utility tasks
 */
gulp.task('clean', require('./config/gulp/clean'));
gulp.task(
  'develop',
  gulp.series('clean', gulp.series('api', 'styles', 'templates'), 'serve')
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
    'scripts',
    gulp.parallel('api', 'images', 'styles'),
    'copy',
    'templates',
    'rev',
    'rev-replace'
  )
);

gulp.task('default', gulp.task('build'));
