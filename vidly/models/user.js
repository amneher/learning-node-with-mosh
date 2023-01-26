const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 255,
		lowercase: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minLength: 2,
		maxLength: 255,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 1024
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, email: this.email }, config.get('jwtPrivateKey'));
	return token;
}

const User = new mongoose.model('User', userSchema);

// const User = new mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(2).max(255).required(),
		email: Joi.string().min(2).max(255).required().email(),
		password: Joi.string().min(2).max(1024).required(),
		isAdmin: Joi.boolean()
	});
	return schema.validate(user);
};

module.exports.User = User;
module.exports.validateUser = validateUser;