const express = require('express');
const router = express.Router();

const movie = require('../models/movie')

router.get('/', async (req, res) => {
	const movies = await movie.Movie.find();
	console.log(movies)
	res.send(movies);
});

router.get('/byId/:id', async (req, res) => {
	const movie_id = req.params.id;
	const result = await movie.Movie.findById(movie_id);
	if (!result) return res.status(404).send('Movie not found.');

	res.send(result);
});

router.post('/', async (req, res) => {
	const { error } = movie.validateMovie(req.body);
	if (error) return res.status(400).send(error);
	const m_obj = new movie.Movie({
		title: req.body.title,
		genre: {
			name: req.body.genre.name,
			isActive: req.body.genre.isActive
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	})
	try {
		const result = m_obj.save();
		res.send(result);
	}
	catch (ex) {
		console.log(ex);
		return res.status(404).send('Movie not found.');
	}
});

router.put('/:id', async (req,res) => {
	const movie_id = req.params.id;
	const result = await movie.Movie.findOneAndUpdate(movie_id, req.body);
	res.send(result);
});

router.delete('/:id', async (req, res) => {
	const result = await movie.Movie.deleteOne({ _id: req.params.id });
	res.send(result);
});

module.exports = router;