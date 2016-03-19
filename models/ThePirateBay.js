"use strict";

var jsdom = require('jsdom'),
    Parse = require('./Parse');

var ThePirateBay = class ThePirateBay {
	constructor() {
	}

	getLastest() {
		return new Promise(function(resolve, reject) {
			jsdom.env({
				url: 'https://thepiratebay.se/top/48h208',
				// url: 'http://test.fdgueux.fr',
				done: function (err, window) {
					let links  = window.document.querySelectorAll('#searchResult tr td:nth-child(2)'),
					    result = [];

					for (var i = 0; i < links.length; i++) {
						let info = new Parse(links[i].querySelector('.detLink').innerHTML);

						if (info.isValid()) {
							result.push({
								name    : info.getName(),
								season  : info.getSeason(),
								episode : info.getEpisode(),
								proper  : info.isProper(),
								magnet: {
									entry   : info.getEntry(),
									uri     : links[i].querySelector('a[href^="magnet:"]').getAttribute('href'),
									team    : info.getTeam(),
									quality : info.getQuality()
								}
							});
						}
					}

					resolve(result);
				}
			});
		});
	}
}

module.exports = exports = new ThePirateBay();