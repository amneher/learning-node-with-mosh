const express = require('express');
const auth = require('../middleware/auth');
const rentalModel = require('../models/rental');
const customerModel = require('../models/customer');
const movieModel = require('../models/movie');
const mongoose = require('mongoose');
const winston = require('winston');
const router = express.Router();

router.get('/', async (req, res) => {
	const rentals = await rentalModel.Rental.find();
	res.send(rentals);
});

router.get('/:id', async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const rental_id = req.params.id;
		const result = await rentalModel.Rental.findById(rental_id);
		if (!result) return res.status(404).send('Rental not found.');

		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Rental Id.');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = rentalModel.validateRental(req.body);
	if (error) return res.status(400).send(error);
	const customer = await customerModel.Customer.findById(req.body.customer);
	if (!customer) return res.status(404).send("Customer not found.");
	const movie = await movieModel.Movie.findById(req.body.movie);
	if (!movie) return res.status(404).send("Movie not found.");

	const rental = new rentalModel.Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			email: customer.email
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		}
	});
	try {
		await rental.save();
		movie.numberInStock--;
		movie.save();
		res.send(rental);
	}
	catch (ex) {
		winston.error(ex);
		return res.status(500).send('Issue saving Rental.');
	}
});

router.put('/:id', auth, async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		const rental_id = req.params.id;
		const result = await rentalModel.Rental.findOneAndUpdate({ _id: rental_id }, req.body);
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Rental Id.');
	}
});

router.delete('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		const result = await rentalModel.Rental.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Rental Id.');
	}
});

module.exports = router;