"use strict";

var nodemon = require('gulp-nodemon');

/**
 * Build vendor, Concat and build our dependencies
 */
module.exports = function(cb) {
	'use strict';

	var called = false;

	return nodemon({
		script: 'app.js',
		ignore: ['public/*', 'tasks/*', 'data/*', 'node_modules/*']
	}).on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	});
};