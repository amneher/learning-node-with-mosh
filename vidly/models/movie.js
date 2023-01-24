const mongoose = require('mongoose');
const Joi = require('joi');
const genre = require('./genre');


const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		minLength: 2,
		maxLength: 255,
		lowercase: true,
		required: true,
		trim: true
	},
	genre: {
		type: genre.genreSchema,
		required: true
	},
	numberInStock: {
		type: Number,
		default: 0,
		min: 0,
		max: 255
	},
	dailyRentalRate: {
		type: Number,
		default: 0,
		min: 0,
		max: 255
	}
})

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(2).required(),
		genreId: Joi.string().required(),
		// genre: Joi.object({
		// 	name: Joi.string().min(3).required(),
		// 	isActive: Joi.boolean()
		// }),
		numberInStock: Joi.number(),
		dailyRentalRate: Joi.number()
	});
	return schema.validate(movie);
};

const Movie = new mongoose.model('Movie', movieSchema);


module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validateMovie = validateMovie;