"use strict";

var MongoDB = require('../models/MongoDB'),
    Serie   = require('../models/Serie');

var ThePirateBay = require('../models/ThePirateBay'),
	TheTVDB      = require('../models/TheTVDB');

MongoDB.connect();

ThePirateBay.getLastest().then(function(links) {
	console.info('[TPB] getLastest() DONE\n');

	function serieManager(links) {
		console.info('[TPB - serieManager] START');

		return new Promise(function(resolve, reject) {
			var series    = [],
			    generator = links[Symbol.iterator]();

			function recursive() {
				var link = generator.next();

				if (!link.done) {
					TheTVDB.search(link.value.name).then(function(results) {
						if(results.length > 0) {
							let serie = series.find(function(serie) {
								return serie._id === results[0].id;
							});

							if (results[0].id === 307151) recursive();

							if (serie === undefined) {
								new Serie(results[0].id).then(function(serie) {
									if (serie.addMagnet(link.value.season, link.value.episode, link.value.magnet)) {
										series.push(serie);
										console.info('[TPB - serieManager] serie : ' + serie.name);
									}

									recursive();
								}, function(err) {
									console.error('[TPB - serieManager] Error with serie : ' + serie.name);
									recursive();
								});
							} else {
								if (serie.addMagnet(link.value.season, link.value.episode, link.value.magnet))
									console.info('[TPB - serieManager] added magnet for : ' + serie.name);

								recursive();
							}
						} else {
							recursive();
						}
					}, function(err) {
						recursive();
					});
				} else {
					console.info('[TPB - serieManager] DONE\n');

					resolve(series);
				}
			}

			recursive();
		});
	}

	serieManager(links).then(function(series) {
		function save(series) {
			console.info('[TPB] Updated series : ');

			var generator = series[Symbol.iterator]();

			return new Promise(function(resolve, reject) {
				function recursive() {
					var serie = generator.next();

					if (!serie.done) {
						serie.value.save(function(err) {
							console.info('[TPB]    * ' + serie.value.name);
							recursive();
						});
					} else {
						console.info('[TPB] Series saved\n');
						resolve(null);
					}
				}

				recursive();
			});
		}

		save(series).then(function() {
			console.info('[TPB] EVERYTHING DONE\n');

			MongoDB.disconnect();
		});
	});
});