"use strict";

var Database  = require('./Database'),
    Sequelize = require('sequelize'),
    magnetURI = require('magnet-uri');

var Magnet = Database.connect().define('magnet', {
	hash       : { type: Sequelize.STRING, primaryKey: true },
	entry      : { type: Sequelize.STRING, allowNull: false },
	uri        : { type: Sequelize.STRING, allowNull: false },
	date       : { type: Sequelize.DATE,   defaultValue: Sequelize.NOW },
	team       : { type: Sequelize.STRING },
	release    : { type: Sequelize.STRING, allowNull: false },
	resolution : { type: Sequelize.STRING, allowNull: false },
	codec      : { type: Sequelize.STRING, allowNull: false }
});

var Episode = Database.connect().define('episode', {
	id       : { type: Sequelize.INTEGER, primaryKey: true },
	number   : { type: Sequelize.INTEGER, allowNull: false },
	name     : { type: Sequelize.STRING,  allowNull: false },
	aired    : { type: Sequelize.DATE,    defaultValue: Sequelize.NOW },
	overview : { type: Sequelize.TEXT,   allowNull: false },
	season   : { type: Sequelize.INTEGER, allowNull: false }
});

var Image = Database.connect().define('image', {
	url       : { type: Sequelize.STRING,  allowNull:  false },
	thumbnail : { type: Sequelize.STRING,  allowNull:  false },
	rating    : { type: Sequelize.INTEGER, allowNull:  false },
	count     : { type: Sequelize.INTEGER, allowNull:  false },
	type      : { type: Sequelize.INTEGER, allowNull:  false } // 0 = fanart | 1 = poster
});

var Serie = Database.connect().define('serie', {
	id          : { type: Sequelize.INTEGER, primaryKey: true },
	name        : { type: Sequelize.STRING,  allowNull: false },
	overview    : { type: Sequelize.TEXT,    allowNull: false },
	network     : { type: Sequelize.STRING,  allowNull: false },
	firstAired  : { type: Sequelize.DATE,    defaultValue: Sequelize.NOW },
	lastupdated : { type: Sequelize.DATE,    defaultValue: Sequelize.NOW },

	// genre       : [ Sequelize.STRING ],
	// actors      : [ Sequelize.STRING ],
	// day         : Sequelize.STRING,
	// time        : Sequelize.STRING,
});

Magnet.belongsTo(Episode);
Image.belongsTo(Serie);
Episode.belongsTo(Serie);

Database.connect().sync({force: true}).then(function() {
	console.log("FINISHED !");
});

// Serie.methods.addMagnet = function (seasonID, episodeNumber, magnet) {
// 	var parsed = magnetURI.decode(magnet.uri);

// 	magnet.hash = parsed.infoHash;

// 	let season = this.seasons.find(function(season) {
// 		return season._id === seasonID;
// 	});

// 	if (season) {
// 		let episode = season.episodes.find(function(episode) {
// 			return episode.number === episodeNumber;
// 		});

// 		if (episode) {

// 			let magnetRes = episode.magnets.find(function(magnetFind) {
// 				return magnetFind.hash === magnet.hash;
// 			});

// 			if(!magnetRes) {
// 				episode.magnets.push(magnet);

// 				return true;
// 			}
// 		}
// 	}

// 	return false;
// }

module.exports = exports = Serie;