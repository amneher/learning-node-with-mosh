const mongoose = require('mongoose');
const Joi = require('joi');
const movie = require('./movie');
const customer = require('./customer');

const rentalSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'customer.Customer'
		// type: customer.customerSchema,
		// required: true
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'movie.Movie'
	},
	rentalDate: {
		type: Date,
		default: Date.now
	},
	rentalDuration: {
		type: Number,
		default: 5
	},
	isOverdue: {
		type: Boolean,
		default: false
	}
})

const Rental = new mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
	const schema = Joi.object({
		// customer: Joi.object({
		// 	fName: Joi.string().min(5).max(255).required(),
		// 	lName: Joi.string().min(5).max(255).required(),
		// 	email: Joi.string().min(5).max(255).required(),
		// 	favoriteGenres: Joi.array().required()
		// }),
		customer: Joi.string().required(),
		movie: Joi.string().required()
	});
	return schema.validate(rental);
};

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validateRental = validateRental;