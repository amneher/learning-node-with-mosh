const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
	app.use(express.json());
	// for url-encoded payloads.
	// i.e.  key=value&key-value...
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static('public'));
	app.use(helmet());
	if (app.get('env') === 'development') {
		app.use(morgan('tiny'));
		 winston.info('Morgan enabled . . .');
	}
	// Import routes
	app.use('/api/genres', genres);
	app.use('/api/customers', customers);
	app.use('/api/movies', movies);
	app.use('/api/rentals', rentals);
	app.use('/api/returns', returns);
	app.use('/', home);
	app.use('/api/users', users);
	app.use('/api/auth', auth);

	app.use(error);
}