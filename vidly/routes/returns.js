const express = require('express');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Return, validateReturn } = require('../models/return');
const mongoose = require('mongoose');
const winston = require('winston');
const router = express.Router();

router.get('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		try {
			const result = await Return.findById(req.params.id);
			res.send(result);
		} catch (DocumentNotFoundError) {
			return res.status(404).send('Return not found.');
		}
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
	

	const returnObj = new Return({
		rental: {
			_id: rental._id
		}
	});
	try {
		const today = Date.now();
		const rentalDate = rental.rentalDate;
		const duration = today - rentalDate;
		returnObj.totalRentalFee = duration * movie.dailyRentalRate;
		rental.return = returnObj._id;
		await rental.save();
		await returnObj.save();
		const movie = Movie.findById(rental.movie._id);
		movie.numberInStock++;
		await movie.save();

		console.log(returnObj);
		res.send(returnObj);
	}
	catch (ex) {
		winston.error(ex);
		return res.status(500).send('Issue saving Return.');
	}
});

module.exports = router;