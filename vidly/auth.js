function auth(req, res, next) {
	// blah blah auth auth . . .
	console.log('Authenticating . . .');
	next();
}

module.exports = auth;