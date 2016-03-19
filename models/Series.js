"use strict";

var Database    = require('./Database'),
    Serie       = require('./Serie'),
    SerieSchema = require('./SerieSchema');

var Series = class Series {
	* add(series)  {
		Database.connect();

		var generator = series[Symbol.iterator]();

		for (let serie of generator)
			yield new Serie(serie);
	}

	getAll(criterias) {
		Database.connect();

		let query = SerieSchema.find({});

		if (criterias !== undefined)
			query.select(criterias);

		return query.exec();
	}
}


module.exports = exports = new Series();