const bcrypt = require('bcrypt');

async function run() {
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash('Blah&1234', salt);
	console.log(salt);
	console.log(hashedPassword);
}

run();