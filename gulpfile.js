var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function () {
  gulp.src('./src/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./app/css/'))
})
