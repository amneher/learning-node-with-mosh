const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const movie = require('../models/movie');
const genreModel = require('../models/genre');

router.get('/', async (req, res) => {
	const movies = await movie.Movie.find();
	console.log(movies)
	res.send(movies);
});

router.get('/byId/:id', async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const movie_id = req.params.id;
		const result = await movie.Movie.findById(movie_id);
		if (!result) return res.status(404).send('Movie not found.');

		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = movie.validateMovie(req.body);
	if (error) return res.status(400).send(error);
	const genre = await genreModel.Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send('Genre not found.');

	const m_obj = new movie.Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	})
	try {
		res.send(m_obj);
	}
	catch (ex) {
		console.log(ex);
		return res.status(404).send('Movie not found.');
	}
});

router.put('/:id', auth, async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const movie_id = req.params.id;
		const result = await movie.Movie.findOneAndUpdate({ _id: movie_id }, req.body);
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

router.delete('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await movie.Movie.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Movie Id.');
	}
});

module.exports = router;