"use strict";

var gulp        = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', require('./tasks/browser-sync'));

gulp.task('nodemon', require('./tasks/nodemon'));
// gulp.task('vendor',  require('./tasks/vendor'));

gulp.task('default', ['nodemon', 'browser-sync'], function() {
	gulp.watch(['./public/**', './views/**'], browserSync.reload);
});