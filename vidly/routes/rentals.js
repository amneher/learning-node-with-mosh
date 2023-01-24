const express = require('express');
const rentalModel = require('../models/rental');
const customerModel = require('../models/customer');
const movieModel = require('../models/movie');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
	const rentals = await rentalModel.Rental.find();
	console.log(rentals)
	res.send(rentals);
});

router.get('/byId/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
	const { error } = rentalModel.validateRental(req.body);
	if (error) return res.status(400).send(error);
	const customer = await customerModel.Customer.findById(req.body.customer);
	if (!customer) return res.status(400).send("Customer not found.");
	const movie = await movieModel.Movie.findById(req.body.movie);
	if (!movie) return res.status(400).send("Movie not found.");

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
		const result = await rental.save();
		movie.numberInStock--;
		movie.save();
		res.send(rental);
	}
	catch (ex) {
		console.log(ex);
		return res.status(404).send('Rental not found.');
	}
});

router.put('/:id', async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const rental_id = req.params.id;
		const result = await rentalModel.Rental.findOneAndUpdate({ _id: rental_id }, req.body);
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Rental Id.');
	}
});

router.delete('/:id', async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await rentalModel.Rental.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Rental Id.');
	}
});

module.exports = router;