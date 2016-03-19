"use strict";

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

/**
 * Build vendor, Concat and build our dependencies
 */
module.exports = function() {
	'use strict';

	var dependencies = './node_modules';

	return gulp.src([
	            	dependencies + '/react/dist/react.js',
	            	dependencies + '/react-dom/dist/react-dom.js'
	           ])
	           .pipe(concat('vendor.min.js', {newLine: "\n;"}))
	           // .pipe(uglify())
	           .pipe(gulp.dest('./public/js'));
};