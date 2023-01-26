const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const passwordComplexity = require("joi-password-complexity");
const router = express.Router();
const {User, validateUser} = require('../models/user');

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let existingUser = await User.findOne({ email: req.body.email });
	if (!existingUser) return res.status(400).send('Invalid email or password.');

	const validPassword = await bcrypt.compare(req.body.password, existingUser.password);
	console.log(validPassword);
	if (!validPassword) return res.status(400).send('Invalid email or password.');
	
	// return a JWT.
	const token = existingUser.generateAuthToken();
	res.send(token);
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().min(2).max(255).required().email(),
		password: Joi.string().min(2).max(1024).required()
	});
	return schema.validate(req.body);
};

module.exports = router;