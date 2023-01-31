const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const _ = require('lodash');
const passwordComplexity = require("joi-password-complexity");
const router = express.Router();

const {User, validateUser} = require('../models/user');

router.get('/', async (req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-password');
	res.send(user);
});

router.post('/', async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let existingUser = await User.findOne({ email: req.body.email });
	if (existingUser) return res.status(400).send('User already exists.');
	const validation = passwordComplexity().validate(req.body.password);
	// console.log(validation);
 	if (validation.error) {
		return res.status(400).send(validation.error);
	}
	const user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
	const salt = await bcrypt.genSalt(12);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();
	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

router.put('/:id', auth, async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		const user_id = req.params.id;
		const result = await User.findOneAndUpdate({ _id: user_id }, req.body);
		const user = await User.findById(req.params.id);
		res.send(user);
	}
	else {
		return res.status(400).send('Invalid User Id.');
	}
});

module.exports = router;