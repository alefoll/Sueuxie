"use strict";

var DOMParser = require('xmldom').DOMParser,
    request   = require('request'),
    Parse     = require('./Parse');

var KickassTorrents = class KickassTorrents {
	constructor() {
	}

	getLastest() {
		return new Promise(function(resolve, reject) {
			var options = {
				url: 'https://kat.cr/tv/?rss=1',
				gzip: true
			};

			request(options, function (error, response, body) {
				if (error)
					return reject(error);

				if (body.Error)
					return reject(body.Error);

				let document = new DOMParser().parseFromString(body),
				    items    = document.documentElement.getElementsByTagName('item'),
				    result   = [];

				for (var i = 0; i < items.length; i++) {
					let info = new Parse(items[i].getElementsByTagName('title')[0].textContent);

					if (info.isValid()) {
						result.push({
							name    : info.getName(),
							season  : info.getSeason(),
							episode : info.getEpisode(),
							proper  : info.isProper(),
							magnet: {
								entry   : info.getEntry(),
								magnet  : items[i].getElementsByTagNameNS('http://xmlns.ezrss.it/0.1/', 'magnetURI')[0].textContent,
								team    : info.getTeam(),
								quality : info.getQuality()
							}
						});
					}
				}

				return resolve(result);
			});
		});
	}
}


module.exports = exports = new KickassTorrents();