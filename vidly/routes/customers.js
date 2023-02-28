const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

const { Customer } = require('../models/customer');
const { validateCustomer } = require('../models/customer');

router.get('/', async (req, res) => {
	const customers = await Customer.find();
	// console.log(customers)
	res.send(customers);
});

router.get('/:id', async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Customer.findById(req.params.id);
		if (!result) return res.status(404).send('Customer not found.');

		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Customer Id.');
	}
});

router.post('/', auth, async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error);

	const customer = new Customer({
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		phone: req.body.phone,
		isGold: req.body.isGold,
		favoriteGenres: req.body.favoriteGenres
	})
	try {
		const result = await customer.save();
		res.send(result);
	}
	catch (ex) {
		console.log(ex);
		return res.status(400).send('Issue saving Customer.' + ex);
	}
});

router.put('/:id', auth, async (req,res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
		const customer = await Customer.findById(req.params.id);
		res.send(customer);
	}
	else {
		return res.status(400).send('Invalid Customer Id.');
	}
});

router.delete('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id)) {
		const result = await Customer.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Customer Id.');
	}
});

module.exports = router;