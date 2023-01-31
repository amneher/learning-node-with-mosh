const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const winston = require('winston');
const router = express.Router();

const customerModel = require('../models/customer');

router.get('/', async (req, res) => {
	let customer = await customerModel.Customer.find().sort('fName');
	res.send(customer);
});

router.get('/:id', async (req, res) => {
	let customer = await customerModel.Customer.findById(req.params.id);
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.post('/', auth, async (req, res) => {
	const { error } = customerModel.validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	if (req.body.favoriteGenres.length < 1) {
		res.status(400).send("A Customer should have at least one favorite genre.");
	}
	let customer = new customerModel.Customer({
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		favoriteGenres: req.body.favoriteGenres
	});
	if (req.body.phone) {
		customer.phone = req.body.phone;
	}
	if (req.body.isGold) {
		customer.isGold = true;
	}
	try {
		const result = await customer.save();
		res.send(result);
	}
	catch (ex) {
		winston.error(ex);
	};
	res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		// const result = await customerModel.Customer.findById(req.params.id);
		const result = await customerModel.Customer.findOneAndUpdate({ _id: req.params.id }, {
			fName: req.body.fName,
			lName: req.body.lName,
			email: req.body.email,
			favoriteGenres: req.body.favoriteGenres,
			phone: req.body.phone,
			isGold: req.body.isGold
		});
		const customer = await customerModel.Customer.findById(result._id);
		res.send(customer);
	}
	else {
		return res.status(400).send('Invalid Customer Id.');
	}
});

router.delete('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		const result = await customerModel.Customer.deleteOne({ _id: req.params.id });
		res.send(result);
	}
	else {
		return res.status(400).send('Invalid Customer Id.');
	}
});

module.exports = router;