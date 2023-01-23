const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = require('./genre');


const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		minLength: 2,
		maxLength: 255,
		lowercase: true,
		required: true
	},
	genre: {
		type: genreSchema,
		required: true
	},
	numberInStock: {
		type: Number,
		default: 0
	},
	dailyRentalRate: {
		type: Number,
		default: 0
	}
})

function validateMovie(movie) {
	const schema = Joi.object({
		name: Joi.string().min(2).required(),
		genre: Joi.object({
			name: Joi.string().min(3).required(),
			isActive: Joi.boolean()
		})
	});
	return schema.validate(movie);
};

const Movie = new mongoose.model('Movie', customerSchema);


module.exports = Movie;