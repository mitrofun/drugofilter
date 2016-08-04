"use strict";
// Include Gulp
const gulp = require('gulp');

// All of your plugins
const jade = require('gulp-jade');
const debug = require('gulp-debug');
const compass = require('gulp-compass');
const browserSync = require('browser-sync').create();


// Watch files for changes
gulp.task('dev:watch', function() {
    gulp.watch('src/jade/**/*.jade',  gulp.series('dev:jade'));
    gulp.watch('src/sass/**/*.scss',  gulp.series('dev:compass'));
});

// Compile HTML from Jade for development
gulp.task('dev:jade', function() {
    return gulp.src(['src/jade/**/*.jade','!src/jade/**/_*.jade'])
        .pipe(debug({title: 'src'}))
        .pipe(jade({pretty: true}))
        .pipe(debug({title: 'jade'}))
        .pipe(gulp.dest('src/'))
});

// Compile CSS from SCSS compass for development
gulp.task('dev:compass', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(compass({
        config_file: 'config.rb',
        css: 'src/css',
        sass: 'src/sass'
      }))
    .pipe(gulp.dest('src/css'))
});

// Run server for development
gulp.task('dev:serve', function () {
   browserSync.init({
       server: 'src'
   });
   browserSync.watch('src/css/*.css', function (event, file) {
        if (event === 'change') {
            browserSync.reload('*.css;');
    }
   });
   browserSync.watch('src/*.html').on('change', browserSync.reload);
   browserSync.watch('src/js/**/*.js').on('change', browserSync.reload);
});


gulp.task('dev',
    gulp.series('dev:jade','dev:compass', gulp.parallel('dev:watch', 'dev:serve'))
);
