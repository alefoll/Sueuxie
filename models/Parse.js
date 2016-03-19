"use strict";

const Parse = class Parse {
	constructor(link) {
		this.entry = link;
		this.valid = false;

		let numero = this.entry.match(/S\d{1,2}E\d{1,2}/);

		if (numero) {
			this.valid = true;

			this.name = this.entry.substring(0, numero.index) // get serie name
			this.name = this.name.replace(/\./g, ' ');       // dot become space
			this.name = this.name.trim();

			this.season  = parseInt(numero[0].substr(1, 2)); // season number
			this.episode = parseInt(numero[0].substr(4, 2)); // episode number

			let info = this.entry.substring(numero.index + numero[0].length, this.entry.length); // end of string after season and episode number
			this.quality = {};

			if (/HDTV/i.test(info))    this.quality.release = 'HDTV';   else
			if (/Web.?DL/i.test(info)) this.quality.release = 'WEBDL';  else
			if (/WEBRip/i.test(info))  this.quality.release = 'WEBRip'; else
			this.valid = false;

			if (/720p/i.test(info))  this.quality.resolution = '720p';  else
			if (/1080p/i.test(info)) this.quality.resolution = '1080p'; else
			this.valid = false;

			if (/264/.test(info)) this.quality.codec = 'H264';  else
			if (/265/.test(info)) this.quality.codec = 'HEVC'; else
			this.valid = false;

			this.proper = /Proper/i.test(info);

			this.team = 'unknown';
			let team = info.match(/(?:(26.-))\w*/); // eg : 264-DIMMENSION

			if (team !== null) {
				this.team = team[0];
				this.team = this.team.substr(4); // eg : DIMMENSION
			}
		}
	}

	getEntry () {
		return this.entry;
	}

	isValid () {
		return this.valid;
	}

	getName () {
		return this.name;
	}

	getSeason () {
		return this.season;
	}

	getEpisode () {
		return this.episode;
	}

	getQuality () {
		return this.quality;
	}

	isProper () {
		return this.proper;
	}

	getTeam () {
		return this.team;
	}
}

module.exports = exports = Parse;