"use strict";

var fs   = require('fs'),
    path = require('path');

var normalizedPath = require("path").join(__dirname);

fs.readdirSync(normalizedPath).forEach(function(file) {
	let basename = path.basename(file, '.js');

	if (basename !== 'index')
		exports[basename] = require("./" + basename);
});

module.exports = exports;