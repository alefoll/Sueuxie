"use strict";

var config  = require('../config.json'),
    Serie = require('../models/Serie');

var React = require('react');

var json = class json {
	getSerieInfo(res, id) {
		new Serie(id, { name: 1, overview: 1, posters: { $slice: 1 }}).then(function(serie) {
			let result = serie.toJSON();

			result.posters = config.datafolder + '/' + serie.posters[0].url;

			res.json(result);
		}, function(err) {
			res.json({
				message: err.message
			});
		});
	}
}

module.exports = exports = new json();