const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const validateObjectId = require('../middleware/badId');

const genreModel = require('../models/genre')

router.get('/', async (req, res) => {
	const genres = await genreModel.Genre.find().sort('name');
	res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const genre = await genreModel.Genre.findById(req.params.id);;
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

router.put('/:id', [ auth, validateObjectId ], async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.Genre.findOneAndUpdate({ _id: genre_id }, {
		name: req.body.name,
		isActive: req.body.isActive
	})
	if (!genre) return res.status(404).send('Genre not found.');
	const { error } = genreModel.validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	res.send(genre);
});

router.delete('/:id', [ auth, admin, validateObjectId ], async (req, res) => {
	const genre_id = req.params.id;
	const genre = await genreModel.Genre.deleteOne({ _id: genre_id });
	if (!genre) return res.status(404).send('Genre not found.');

	res.send(genre);
});

module.exports = router;