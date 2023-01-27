const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function(app) {
	const db = config.get("db");
	mongoose.set('strictQuery', false);
	mongoose.connect(db)
		.then(() => winston.info(`connected to ${db}`));
}
