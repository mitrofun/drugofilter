// Dependencies
import gulp from 'gulp';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';

import pkg from './package.json';
const dirs = pkg['app-configs'].directories;

// Include tasks/ folder
requireDir('./tasks', {recurse: true});

// Tasks

gulp.task('develop', () => {
	global.production = false;
	runSequence("jade", "sass");
});

gulp.task('watch', () => {
    gulp.watch(`${dirs.src}/sass/**/*.scss`, ["sass"]);
    gulp.watch(`${dirs.src}/**/*.jade`, ["jade"]);
    // gulp.watch(`${dirs.src}/js/**/*.js`, ["js"]);
});


gulp.task('default', ['develop', 'watch', 'connect']);
