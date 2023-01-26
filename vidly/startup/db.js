const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function(app) {
	mongoose.connect('mongodb://localhost/vidly')
		.then(() => winston.info('connected to mongodb...'));
}
