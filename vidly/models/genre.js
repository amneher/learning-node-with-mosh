const mongoose = require('mongoose');
const Joi = require('joi');

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

async function getAllGenres() {
	const genres = await Genre.find();
	console.log(genres)
	return genres
}

async function createGenre(data) {
	const genre = new Genre({
		name: data.name,
		isActive: data.isActive
	})
	try {
		const result = genre.save();
	}
	catch (ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field]);
		}
	}
}

async function getGenreById(id) {
	const genre = await Genre.findById(id);
	return genre
}

async function getGenreByName(name) {
	const genre = await Genre.findOne({
		name: name
	});
	return genre
}

async function updateGenre(id, data) {
	const genre = await Genre.findOneAndUpdate(id, data);
	return genre;
}

async function deleteGenre(id) {
	const genre = await Genre.deleteOne({ _id: id });
	return genre;
}

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		isActive: Joi.boolean()
	});
	return schema.validate(genre);
};

module.exports.genreSchema = genreSchema
module.exports.getAllGenres = getAllGenres
module.exports.createGenre = createGenre
module.exports.getGenreById = getGenreById
module.exports.getGenreByName = getGenreByName
module.exports.updateGenre = updateGenre
module.exports.deleteGenre = deleteGenre
module.exports.validateGenre = validateGenre