"use strict";

var MongoDB = require('../models/MongoDB'),
    Series  = require('../models/Series'),
    TheTVDB = require('../models/TheTVDB');

MongoDB.connect();

Series.getAll().then(function(series) {

	function downloadManager(series) {
		return new Promise(function(resolve, reject) {
			var generator = series[Symbol.iterator]();

			function recursive() {
				var serie = generator.next();

				if (!serie.done) {
					console.info('[checkImage] Serie ' + serie.value.name + ' start');

					Promise.all([TheTVDB.getImages(serie.value.id, 'fanart'),
					             TheTVDB.getImages(serie.value.id, 'poster')])
					       .then(function(values) {
					       		serie.value.fanarts = values[0];
					       		serie.value.posters = values[1];

					       		serie.value.save(function(err) {
					       			console.info('[checkImage] Serie ' + serie.value.name + ' done!\n ');

					       			recursive();
					       		});
					       })
				} else {
					resolve(null);
				}
			}

			recursive();
		});
	}

	downloadManager(series).then(function() {
		console.info('[checkImage] DONE');

		MongoDB.disconnect();
	});
});