const express = require('express');
const router = express.Router();
const Joi = require('joi');

const genreModel = require('../models/genre')

router.get('/', async (req, res) => {
	const genres = await genreModel.getAllGenres();
	res.send(genres);
});

router.get('/byId/:id', async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.getGenreById(genre_id);
	console.log(genre)
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

router.get('/byName/:name', async (req, res) => {
	const genre_name = req.params.name;
	const genre = await genreModel.getGenreByName(genre_name);
	console.log(genre)
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

router.post('/', async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await genreModel.createGenre({
		name: req.body.name,
		isActive: req.body.isActive
	});
	res.send(genre);
});

router.put('/:id', async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.updateGenre(genre_id, {
		name: req.body.name,
		isActive: req.body.isActive
	})
	if (!genre) return res.status(404).send('Genre not found.');
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	res.send(genre);
});

router.delete('/:id', async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.deleteGenre(genre_id);
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		isActive: Joi.boolean()
	});
	return schema.validate(genre);
};

module.exports = router;