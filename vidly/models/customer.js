const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function arrayValidator(v) {
	return new Promise((resolve, reject) => {
		const result = v && v.length > 0;
		resolve(result);
	});
}

const customerSchema = new mongoose.Schema({
	fName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	lName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	phone: {
		type: String,
		required: false,
		minLength: 5,
		maxLength: 255
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isGold: {
		type: Boolean,
		default: false
	},
	dateJoined: {
		type: Date,
		default: Date.now
	},
	favoriteGenres: { 
		type: Array,
		// required: true
		validate: [ arrayValidator, "A Customer should have at least one favorite genre." ]
	}
});

const Customer = new mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
	const schema = Joi.object({
		fName: Joi.string().min(5).max(255).required(),
		lName: Joi.string().min(5).max(255).required(),
		email: Joi.string().min(5).max(255).required(),
		phone: Joi.string().min(5).max(255),
		isGold: Joi.boolean(),
		favoriteGenres: Joi.array().required()
	});
	return schema.validate(customer);
};

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validateCustomer = validateCustomer;
module.exports.arrayValidator = arrayValidator;