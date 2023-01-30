const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const customerModel = require('../models/customer');

router.get('/', async (req, res) => {
	let customer = await customerModel.Customer.find().sort('fName');
	res.send(customer);
});

router.get('/:id', async (req, res) => {
	let customer = await customerModel.Customer.findById(req.params.id);
	console.log(customer)
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.post('/', auth, async (req, res) => {
	const { error } = customerModel.validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let customer = new customerModel.Customer({
		fName: data.fName,
		lName: data.lName,
		email: data.email,
		favoriteGenres: data.favoriteGenres
	});
	if (data.phone) {
		customer.phone = data.phone;
	}
	if (data.isGold) {
		customer.isGold = true;
	}
	try {
		const result = customer.save();
		return result;
	}
	catch (ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field]);
		}
		return ex
	};
	res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
	if ( mongoose.Types.ObjectId.isValid(req.params.id) ) {
		const customer_id = req.params.id;
		const result = await customerModel.Customer.findOneAndUpdate({ _id: customer_id }, req.body);
		res.send(result);
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