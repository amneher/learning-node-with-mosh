const express = require('express');
const moment = require('moment');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Return, validateReturn } = require('../models/return');
const mongoose = require('mongoose');
const winston = require('winston');
const router = express.Router();

router.get('/', auth, async (req, res) => {
	const result = await Return.find();
	if (!result) {
		return res.status(404).send('Return not found.');
	}
	res.send(result);
});

router.get('/:id', auth, async (req, res) => {
	const rental_id = req.params.id;
	if ( mongoose.Types.ObjectId.isValid(rental_id)) {
		const result = await Return.findById(rental_id);
		if (!result) {
			return res.status(404).send('Return not found.');
		}
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Return Id.');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = validateReturn(req.body);
	if (error) return res.status(400).send(error);
	const rental = await Rental.findById(req.body.rental);
	if (!rental) return res.status(404).send("Rental not found.");
	const movie = await Movie.findById(rental.movie._id.toHexString());
	console.log(rental.return);
	if (rental.returnDate) return res.status(400).send("Rental already returned.");

	const returnObj = new Return({
		rental: rental._id
	});
	try {
		const today = moment();
		const rentalDate = rental.rentalDate;
		const durationEpoch = today - rentalDate;
		const daySecs = 60 * 60 * 24 * 1000;
		const duration = (Math.round((durationEpoch/daySecs) * 1) / 1);
		const totalRate = duration * movie.dailyRentalRate;
		returnObj.totalRentalFee = totalRate;
		rental.returnDate = moment();
		await rental.save();
		await returnObj.save();
		movie.numberInStock++;
		await movie.save();		
		// console.log(returnObj);
		res.send(returnObj);
	}
	catch (ex) {
		winston.error(ex);
		return res.status(500).send('Issue saving Return.');
	}
});

module.exports = router;