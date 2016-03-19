"use strict";

var Database    = require('./Database'),
    SerieSchema = require('./SerieSchema'),
    TheTVDB     = require('./TheTVDB');

const Serie = class Serie {
	constructor(id, criterias) {
		var self = this;

		Database.connect();

		if (id !== undefined) {
			return new Promise(function(resolve, reject) {
				let query = SerieSchema.findOne({ '_id': id });

				if (criterias !== undefined)
					query.select(criterias);

				query.exec(function(err, serie) {
					if (err)
						reject(err);

					if (serie === null) {
						console.info('[Serie] Initialise from TheTVDB : ' + id);

						self.initFromTheTVDB(id).then(function(result) {
							result.save(function(err) {
								resolve(result);
							});
						}, function(err) {
							reject(err);
						});
					} else {
						resolve(serie);
					}
				});
			});
		}
	}

	initFromTheTVDB(id) { // Check getSerie (continuuing) then do getEpisodes and getImages

		// Maybe getSerie then other (case if serie is wrong)
		return Promise.all([TheTVDB.getSerie(id),
		                    TheTVDB.getEpisodes(id),
		                    TheTVDB.getImages(id, 'fanart'),
		                    TheTVDB.getImages(id, 'poster')])
		              .then(function(values) {
		              	let seasons = [];

		              	if (values[2].length === 0 || values[3].length === 0)
		              		return Promise.reject("No ressource (fanart or poster)");

		              	values[1].forEach(function(episode) {
		              		let seasonID = parseInt(episode.airedSeason);

		              		let season = seasons.find(function(season) {
		              			return season._id === seasonID;
		              		});

		              		if (season === undefined) {
		              			season = {
		              				_id      : seasonID,
		              				episodes : []
		              			}

		              			seasons.push(season);
		              		}

		              		season.episodes.push({
		              			_id      : episode.id,
		              			number   : parseInt(episode.airedEpisodeNumber),
		              			name     : episode.episodeName,
		              			aired    : episode.firstAired,
		              			overview : episode.overview
		              		});
		              	});

		              	return new SerieSchema({
		              		_id         : values[0].data.id,
		              		name        : values[0].data.seriesName,
		              		genre       : values[0].data.genre,
		              		overview    : values[0].data.overview,
		              		actors      : values[0].data.actors,
		              		network     : values[0].data.network,
		              		firstAired  : values[0].data.firstAired,
		              		day         : values[0].data.airsDayOfWeek,
		              		time        : values[0].data.airsTime,
		              		seasons     : seasons,
		              		fanarts     : values[2],
		              		posters     : values[3],
		              	});
		              }, function(err) {
		              	console.error('[Serie ERROR] ' + err);
		              	return Promise.reject(err);
		              });
	}
}

module.exports = exports = Serie;