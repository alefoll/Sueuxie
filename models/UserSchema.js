"use strict";

var mongoose = require('mongoose'),
    Serie    = require('./Serie'),
    Quality  = require('./QualitySchema'),
    Schema   = mongoose.Schema;

var UserSerie = new Schema({
	_id         : Number,
	lastSeason  : Number,
	lastEpisode : Number,
	quality     : Quality.schema // Optional (exist only if different with default quality)
});

var UserSchema = new Schema({
	series  : [ UserSerie ],
	quality : Quality.schema // Default quality
});

UserSchema.methods.addSerie = function (serieID, season, episode) {
	let existSerie = this.series.find(function(serie) {
		return serie._id === serieID;
	});

	if (existSerie) {
		existSerie.lastSeason  = season;
		existSerie.lastEpisode = episode;
	} else {
		this.series.push({
			_id         : serieID,
			lastSeason  : season,
			lastEpisode : episode
		});
	}

	console.log('[UserSchema] series : ' + this.series);
}

UserSchema.methods.getNewMagnets = function() {
	var self = this;

	return new Promise(function(resolve, reject) {
		var generator   = self.series[Symbol.iterator](),
		    magnets = [];

		function recursive() {
			var serie = generator.next();

			if (!serie.done) {
				new Serie(serie.value._id, "seasons").then(function(ss) {
					let seasons = ss.seasons.filter(function(season) {
						return season._id >= serie.value.lastSeason;
					});

					if (seasons.length > 0) {
						let quality = serie.value.quality || self.quality;

						seasons[0].episodes.forEach(function(episode) {
							if ((episode.number > serie.value.lastEpisode) && (episode.magnets.length > 0)) {
								episode.magnets.forEach(function(magnet) {
									if (quality === magnet.quality)
										magnets.push(magnet);
								});
							}
						});

						for (var i = 1; i < seasons.length; i++) {
							seasons[i].episodes.forEach(function(episode) {
								episode.magnets.forEach(function(magnet) {
									if (quality === magnet.quality)
										magnets.push(magnet);
								});
							});
						}
					}

					// TODO : Filter torrent by quality
					// Maybe bug with last = 3x2 and for example last serie is season 7 and episode 9
					// user might just download all above episode 5 and season 3 but not S04E01 S04E02 S05E01 S05E02 ...

					recursive();
				});
			} else {
				resolve(magnets);
			}
		}

		recursive();
	});
}

module.exports = exports = mongoose.model('User', UserSchema);