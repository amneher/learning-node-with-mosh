const express = require('express');
const router = express.Router();

const Movie = require('../models/movie')

router.get('/', async (req, res) => {
	const movies = await Movie.find();
	console.log(movies)
	res.send(movies);
});

router.get('/byId/:id', async (req, res) => {
	const movie_id = req.params.id;
	const movie = await Movie.findById(id);
	if (!movie) return res.status(404).send('Movie not found.');

	res.send(movie);
});

router.post('/', async (req, res) => {
	const { error } = Movie.validateMovie(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const movie = new Movie({
		name: data.name,
		genre: {
			name: req.body.genre.name,
			isActive: req.body.genre.isActive
		}
	})
	try {
		const result = movie.save();
		res.send(result);
	}
	catch (ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field]);
		}
	}
});

router.put('/:id', async (req,res) => {
	const movie_id = req.params.id;
	const movie = await Movie.findOneAndUpdate(id, data);
	res.send(movie);
});

router.delete('/:id', async (req, res) => {
	const movie = await Movie.deleteOne({ _id: req.params.id });
	res.send(movie);
})