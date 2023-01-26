const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const customerModel = require('../models/customer');

router.get('/', async (req, res) => {
	let customer = await customerModel.getAllCustomers();
	res.send(customer);
});

router.get('/:id', async (req, res) => {
	let customer_id = req.params.id;
	let customer = await customerModel.getCustomerById(customer_id);
	console.log(customer)
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.get('/byName/:fName', async (req, res) => {
	let customer_name = req.params.name;
	let customer = await customerModel.getCustomer({ fName: customer_name });
	console.log(customer)
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.post('/', auth, async (req, res) => {
	const { error } = customerModel.validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let customer = await customerModel.createCustomer({
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		phone: req.body.phone,
		isGold: req.body.isGold,
		favoriteGenres: req.body.favoriteGenres
	});
	res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
	let customer_id = req.params.id;
	let customer = await customerModel.updateCustomer(customer_id, {
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		phone: req.body.phone,
		isGold: req.body.isGold,
		favoriteGenres: req.body.favoriteGenres
	})
	if (!customer) return res.status(404).send('Customer not found.');
	const { error } = customerModel.validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
	let customer_id = req.params.id;
	let customer = await customerModel.deleteCustomer(customer_id);
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

module.exports = router;