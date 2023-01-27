const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true
	}
});

const Genre = new mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		isActive: Joi.boolean()
	});
	return schema.validate(genre);
};

module.exports.Genre = Genre
module.exports.genreSchema = genreSchema
module.exports.validateGenre = validateGenre