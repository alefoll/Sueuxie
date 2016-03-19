"use strict";

var browserSync = require('browser-sync');

/**
 * Build vendor, Concat and build our dependencies
 */
module.exports = function() {
	'use strict';

	browserSync.init({
		notify    : false,
		debugInfo : false,
		proxy     : "http://127.0.0.1:8000"
	});
};