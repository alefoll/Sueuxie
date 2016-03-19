"use strict";

var config    = require('../config.json'),
    Sequelize = require('sequelize');

const Database = class Database {
	constructor() {
		this.connection = null;
	}

	connect() {
		if (this.connection === null) {
			this.connection = new Sequelize(config.database.database, config.database.username, config.database.password, {
				host: config.database.host,
				dialect: config.database.type
			});

			console.info("[Database - " + config.database.type + "] New connection");
		}

		return this.connection;
	}

	disconnect() {
		this.connection.disconnect();

		console.info("[Database - " + config.database.type + "] Disconnected");
	}
}


module.exports = exports = new Database;