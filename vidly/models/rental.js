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
		type: movie.movieSchema,
		required: true
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
		movie: Joi.object({
			title: Joi.string().min(2).required(),
			genre: Joi.object({
				name: Joi.string().min(3).required(),
				isActive: Joi.boolean()
			}),
			numberInStock: Joi.number(),
			dailyRentalRate: Joi.number()
		}),
		rentalDate: Joi.date(),
		rentalDuration: Joi.number().min(2).max(15),
		isOverdue: Joi.boolean()
	});
	return schema.validate(rental);
};

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validateRental = validateRental;