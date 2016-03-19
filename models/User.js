"use strict";

var Database    = require('./Database'),
    UserSchema  = require('./UserSchema'),
    TheTVDB     = require('./TheTVDB');

const User = class User {
	constructor(id, criterias) {
		Database.connect();

		return new Promise(function(resolve, reject) {
			if (id !== undefined) {
				let query = UserSchema.findOne({ '_id': id });

				if (criterias !== undefined)
					query.select(criterias);

				query.exec(function(err, user) {
					if (err)
						reject(err);

					if (user !== null)
						resolve(user);
					else
						reject('[User] User not found : ' + id);
				});
			} else {
				resolve(new UserSchema());
			}
		});
	}
}

module.exports = exports = User;