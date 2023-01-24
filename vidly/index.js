const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
// We'll use Mongoose later...
const MongoClient = require('mongodb').MongoClient;
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
// can also just use one 'debug' object.
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const log = require('./middleware/logger');
const auth = require('./auth');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');  // this is the default, don't need to set it.

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('connected to mongodb...'))
	.catch(err => console.error('could not connect to mongodb ', err));

// Config
console.log(`App name: ${config.get('name')}`);
console.log(`Mail server name: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);

app.use(express.json());
// for url-encoded payloads.
// i.e.  key=value&key-value...
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
if (app.get('env') === 'development') {
	app.use(morgan('tiny'));
	startupDebugger('Morgan enabled . . .');
}
// Import routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/', home);

// debugging the db
dbDebugger('Debugging the db . . . ');

// basic learn-how middlewares.
app.use(log);
app.use(auth);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));