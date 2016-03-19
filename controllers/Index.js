"use strict";

var config  = require('../config.json'),
    MongoDB = require('../models/MongoDB'),
    Series  = require('../models/Series');

// import MongoDB from '../models/MongoDB';

var ThePirateBay = require('../models/ThePirateBay'),
    Kickass      = require('../models/KickassTorrents'),
    TheTVDB      = require('../models/TheTVDB');

var Index = class Index {
	render(res) {
		MongoDB.connect();

		Series.getAll({ name: 1, fanarts: { $slice: 1 }, posters: { $slice: 1 }}).then(function(series) {
			// Shuffle
			for(var j, x, i = series.length; i; j = Math.floor(Math.random() * i), x = series[--i], series[i] = series[j], series[j] = x);

			res.render('index', {
				title      : "Test",
				series     : series,
				datafolder : config.datafolder
			});
		});
	}

	tpb(res) {
		ThePirateBay.getLastest().then(function(links) {
			function searchManager(generator) {
				return new Promise(function(resolve, reject) {
					var accumulator = [];

					function recusive() {
						var link = generator.next();

						if (!link.done) {
							TheTVDB.search(link.value.name).then(function(results) {
								if(results.length > 0) {
									link.value.thetvdb = results[0];

									accumulator.push(link.value);
								}

								recusive();
							});
						} else {
							resolve(accumulator);
						}
					}

					recusive();
				});
			}

			searchManager(links[Symbol.iterator]()).then(function(data) {
				res.render('tpb', {
					title: "The Pirate Bay",
					links: data
				});
			});
		});
	}
}

module.exports = exports = new Index;