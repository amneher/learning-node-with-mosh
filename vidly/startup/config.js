const config = require('config');
const winston = require('winston');

module.exports = function(app) {
	if (!config.get('jwtPrivateKey')) {
		throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
		process.exit(1);
	}
	if (!config.get('mail.password')) {
		throw new Error("FATAL ERROR: mail.password is not defined.");
		process.exit(1);
	}

	app.set('view engine', 'pug');
	app.set('views', './views');  // this is the default, don't need to set it.

	// Config
	winston.info(`App name: ${config.get('name')}`);
	winston.info(`Mail server name: ${config.get('mail.host')}`);
	winston.info(`Mail password: ${config.get('mail.password')}`);
}