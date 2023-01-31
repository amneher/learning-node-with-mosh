const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

const { Movie } = require('../models/movie');
const { validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
	const movies = await Movie.find();
	// console.log(movies)
	res.send(movies);
});

router.get('/:id', async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Movie.findById(req.params.id);
		if (!result) return res.status(404).send('Movie not found.');

		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) return res.status(400).send(error);
	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send('Genre not found.');

	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	})
	try {
		const result = await movie.save();
		res.send(result);
	}
	catch (ex) {
		console.log(ex);
		return res.status(400).send('Issue saving Movie.' + ex);
	}
});

router.put('/:id', auth, async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Movie.findOneAndUpdate({ _id: req.params.id }, req.body);
		const movie = await Movie.findById(req.params.id);
		res.send(movie);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

router.delete('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Movie.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

module.exports = router;