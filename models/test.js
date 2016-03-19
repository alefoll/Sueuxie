"use strict";

var Database = require('./Database');

var Serie       = require('./Serie'),
	Series      = require('./Series'),
	SerieSchema = require('./SerieSchema'),
	Quality     = require('./QualitySchema').model,
	User        = require('./User'),
	TheTVDB     = require('./TheTVDB'),
	Parse       = require('./Parse');

// Series.getAll().then(function(series) {
// 	series.forEach(function(serie) {
// 		console.log(serie.name);
// 	});

// 	Database.disconnect();
// });

// new Serie(262407, { name: 1 }).then(function(serie) {
	// console.log(serie);
	// console.log("Done");
	// Database.disconnect();

	// serie.save().then(function(result) {
	// 	console.log('done');

	// 	Database.disconnect();
	// }).onRejected(function (err) {
	// 	console.log(err);
	// });
// });

// var series = Series.add([121361, 153021, 176941, 247808, 248742, 253463, 257655, 259765, 266189, 273181, 279121, 281662, 78804]);

// for(let serie of series)
// 	console.log(serie + " done!");

// Database.connect();

// function tete(id) {
// 	return new Serie(id);
// }

// let test = yield tete(121361);

// console.log(test);

// Database.disconnect();

// TheTVDB.search('Grand Designs NZ').then(function(data) {
// 	console.log(data);
// })

// let info = new Parse("The.Big.Bang.Theory.S09E01.720p.HDTV.X264-DIMENSION[EtHD]");

// console.log(info.getSerie());

// new Serie(257655).then(function(serie) {
// 	console.log(serie.seasons);

// 	Database.disconnect();
// })

// TheTVDB.getEpisodes(80379).then(function(episodes) {
// 	let result = [];

// 	episodes.forEach(function(episode) {
// 		if (result.indexOf(episode.airedSeason) === -1) {
// 			result.push(episode.airedSeason);
// 		}
// 	});

// 	// console.log(episodes);
// 	console.log(result);
// });

// new Serie(277021).then(function(serie) {
// 	console.log(serie);
// })

new User('5631052db63c82e418691c30').then(function(user) {
	console.log('[USER] user : ' + user);
	user.quality = {
		release    : "babou",
		resolution : "coucou",
		codec      : "toi"
	}

	user.save(function(err) {
		console.log(err);
		Database.disconnect();
	})

	// user.getNewMagnets().then(function(res) {
	// 	console.log(res);

	// 	Database.disconnect();
	// });

	// user.addSerie(279121, 2, 3);

	// user.save(function() {
	// });
}, function(err) {
	console.log(err);
});
