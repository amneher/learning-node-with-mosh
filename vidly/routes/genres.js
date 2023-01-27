const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

const genreModel = require('../models/genre')

router.get('/', async (req, res) => {
	const genres = await genreModel.Genre.find().sort('name');
	res.send(genres);
});

router.get('/byId/:id', async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.Genre.findById(genre_id);;
	console.log(genre)
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

router.get('/byName/:name', async (req, res) => {
	const genre_name = req.params.name;
	const genre = await Genre.findOne({
		name: genre_name
	});;
	console.log(genre)
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

router.post('/', auth, async (req, res) => {
	const { error } = genreModel.validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const genre = new genreModel.Genre({
		name: req.body.name,
		isActive: req.body.isActive
	});
	const result = await genre.save();
	res.send(result);
});

router.put('/:id', auth, async (req, res) => {
	const genre_id = req.params.id;
	const genre = await Genre.findOneAndUpdate({ _id: genre_id }, {
		name: req.body.name,
		isActive: req.body.isActive
	})
	if (!genre) return res.status(404).send('Genre not found.');
	const { error } = genreModel.validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const genre_id = req.params.id;
	const genre = await Genre.deleteOne({ _id: genre_id });
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

module.exports = router;