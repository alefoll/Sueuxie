"use strict";

var MongoDB = require('../models/MongoDB'),
    Series  = require('../models/Series');

MongoDB.connect();

Series.getAll().then(function(series) {
	function removeManager(series) {
		return new Promise(function(resolve, reject) {
			var generator = series[Symbol.iterator]();

			function recursive() {
				var serie = generator.next();

				if (!serie.done) {
					serie.value.seasons.forEach(function(season) {
						season.episodes.forEach(function(episode) {
							if (episode.magnets.length > 0)
								episode.magnets = [];
						});
					});

					serie.value.save(function(err) {
						console.info('[removeAllMagnet] Serie ' + serie.value.name + ' done!');

						recursive();
					});
				} else {
					resolve(null);
				}
			}

			recursive();
		});
	}

	removeManager(series).then(function() {
		console.info('[removeAllMagnet] DONE');

		MongoDB.disconnect();
	});
});