"use strict";

var config      = require('../config.json'),
    DOMParser   = require('xmldom').DOMParser,
    fs          = require('fs'),
    levenshtein = require('fast-levenshtein'),
    mkdirp      = require('mkdirp'),
    path        = require('path'),
    request     = require('request');

var TheTVDB = class TheTVDB {
	constructor() {
		this.url    = 'https://api-beta.thetvdb.com/';
		this.oldurl = 'http://thetvdb.com/api/';
		this.token  = '';
	}

	getToken() {
		var self = this;

		return new Promise(function(resolve, reject) {
			if (self.token !== '')
				return resolve(self.token);

			var options = {
				url: self.url + 'login',
				method: 'POST',
				json: {
					'apikey'   : config.thetvdb.apikey,
					'username' : config.thetvdb.username,
					'userpass' : config.thetvdb.userpass
				}
			};

			request(options, function (error, response, body) {
				if (error)
					return reject(error);

				self.token = body.token;

				return resolve(body.token);
			});
		});
	}

	search(keywords) {
		var self = this;

		return this.getToken().then(function(token) {
			return new Promise(function(resolve, reject) {
				let options = {
					url: self.url + 'search/series?name=' + encodeURIComponent(keywords),
					headers: {
						'Authorization' : 'Bearer ' + token
					}
				};

				request(options, function (error, response, body) {
					if (error)
						return reject(error);

					let json = JSON.parse(body);

					if (json.Error)
						return reject(json.Error);

					let results = json.data.filter(function(serie) {
						return serie.status === 'Continuing';
					});

					results.forEach(function(result) {
						result.levenshtein = levenshtein.get(keywords, result.seriesName);
					});

					results.sort(function(a, b) {
						return a.levenshtein - b.levenshtein;
					});

					return resolve(results);
				});
			});
		});
	}

	getSerie(id) {
		var self = this;

		return this.getToken().then(function(token) {
			return new Promise(function(resolve, reject) {
				var options = {
					url: self.url + 'series/' + id,
					headers: {
						'Authorization' : 'Bearer ' + token
					}
				};

				request(options, function (error, response, body) {
					if (error)
						return reject(error);

					let json = JSON.parse(body);

					if (json.Error)
						return reject(json.Error);

					return resolve(JSON.parse(body));
				});
			});
		});
	}

	getEpisodes(id, page) {
		var self = this;

		page = (page ? page : 1);

		return this.getToken().then(function(token) {
			return new Promise(function(resolve, reject) {
				var accumulator = [];


				function recursive() {
					var options = {
						url: self.url + 'series/' + id + '/episodes?page=' + page,
						headers: {
							'Authorization' : 'Bearer ' + token
						}
					};

					request(options, function (error, response, body) {
						if (error)
							return reject(error);

						let json = JSON.parse(body);

						if (json.Error)
							return reject(json.Error);

						accumulator = accumulator.concat(json.data);

						if (json.links.next !== null)
							recursive(++page);
						else
							return resolve(accumulator);
					});
				}

				recursive();
			});
		});
	}

	getImages(id, type) {
		var self = this;

		var bannerUrl = 'http://thetvdb.com/banners/',
		    folder    = id + '/banners/' + type + '/',
		    dest      = config.datafolder + '/' + folder,
		    clients   = 5;

		function getXML() {
			return new Promise(function(resolve, reject) {
				var options = {
					url: self.oldurl + config.thetvdb.apikey + '/series/' + id + '/banners.xml'
				};

				request(options, function (error, response, body) {
					if (error)
						return reject(error);

					return resolve(body);
				});
			});
		}

		function* genData(data) {
			var document = new DOMParser().parseFromString(data),
				banners  = document.getElementsByTagName('Banner');

			for (var i = 0, l = banners.length; i < l; i++) {
				if (banners[i].getElementsByTagName('BannerType')[0].textContent === type) {
					yield {
						url       : banners[i].getElementsByTagName('BannerPath')[0].textContent,
						thumbnail : '_cache/' + banners[i].getElementsByTagName('BannerPath')[0].textContent,
						rating    : banners[i].getElementsByTagName('Rating')[0].textContent | 0,
						count     : banners[i].getElementsByTagName('RatingCount')[0].textContent
					}
				}
			}
		}

		function checkFolder() {
			return new Promise(function(resolve, reject) {
				mkdirp(dest, function (err) {
					if (err)
						reject(err);

					resolve();
				});
			});
		}

		function downloadManager(generator) {
			return new Promise(function(resolve, reject) {
				var accumulator = [];

				function recursive() {
					var link = generator.next();

					if (!link.done) {
						download(link.value.url).then(function(filepathURL) {
							link.value.url = filepathURL;

							download(link.value.thumbnail, '-thumb').then(function(filepathThumbnail) {
								link.value.thumbnail = filepathThumbnail;

								accumulator.push(link.value);

								recursive();
							}, function(err) {
								console.error('[TheTVDB - download] Error : ' + err);
								recursive();
							});
						}, function(err) {
							console.error('[TheTVDB - downloadManager] Error : ' + err);
							recursive();
						});
					} else {
						resolve(accumulator);
					}
				}

				recursive();
			});
		}

		function download(link, tag) {
			return new Promise(function(resolve, reject) {
				var parse    = path.parse(link),
					filename = parse.name.replace(id + '-', '') + (tag ? tag : '')  + parse.ext,
					filepath = dest + filename;

				fs.exists(filepath, function(exists) {
					if (!exists) {
						request(bannerUrl + link)
							.on('error', function(err) {
								reject(err);
							})
							.on('end', function() {
								resolve(folder + filename); // don't need config.datafolder
							})
							.pipe(fs.createWriteStream(filepath));
					} else {
						resolve(folder + filename); // don't need config.datafolder
					}
				});
			});
		}

		return getXML().then(function(data) {
			var generator = genData(data);

			return checkFolder().then(function() {
				return new Promise(function(resolve, reject) {
					var promises = [];

					for (var i = 0; i < clients; i++)
						promises.push(downloadManager(generator, i));

					Promise.all(promises).then(function(datas) {
						let results = [];

						for (let data of datas)
							results = results.concat(data);

						resolve(results);
					}, function (err) {
						console.error("Error !");
						console.error(err);
					});
				});
			});
		});
	}
};

module.exports = exports = new TheTVDB();