
function log(req, res, next) {
	console.log('Logging . . .');  // Could do some logging or something here.
	next();
}

module.exports = log;