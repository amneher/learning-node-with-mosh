const express = require('express');
const router = express.Router();

const rental = require('../models/rental')

router.get('/', async (req, res) => {
	const rentals = await rental.Rental.find();
	console.log(rentals)
	res.send(rentals);
});

router.get('/byId/:id', async (req, res) => {
	const rental_id = req.params.id;
	const result = await rental.Rental.findById(rental_id);
	if (!result) return res.status(404).send('Rental not found.');

	res.send(result);
});

router.post('/', async (req, res) => {
	const { error } = rental.validateRental(req.body);
	if (error) return res.status(400).send(error);
	const m_obj = new rental.Rental({
		customer: req.body.customer,
		movie: {
			title: req.body.movie.title,
			genre: {
				name: req.body.movie.genre.name,
				isActive: req.body.movie.genre.isActive
			},
			numberInStock: req.body.movie.numberInStock,
			dailyRentalRate: req.body.movie.dailyRentalRate
		},
		rentalDate: req.body.rentalDate,
		rentalDuration: req.body.rentalDuration,
		isOverdue: req.body.isOverdue
	});
	try {
		const result = m_obj.save();
		res.send(result);
	}
	catch (ex) {
		console.log(ex);
		return res.status(404).send('Rental not found.');
	}
});

router.put('/:id', async (req,res) => {
	const rental_id = req.params.id;
	const result = await rental.Rental.findOneAndUpdate(rental_id, req.body);
	res.send(result);
});

router.delete('/:id', async (req, res) => {
	const result = await rental.Rental.deleteOne({ _id: req.params.id });
	res.send(result);
});

module.exports = router;