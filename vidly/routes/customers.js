const express = require('express');
const router = express.Router();
const Joi = require('joi');

const customerModel = require('../models/customer');

router.get('/', async (req, res) => {
	const customer = await customerModel.getAllCustomers();
	res.send(customer);
});

router.get('/:id', async (req, res) => {
	const customer_id = req.params.id;
	const customer = await customerModel.getCustomerById(customer_id);
	console.log(customer)
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.get('/byName/:fName', async (req, res) => {
	const customer_name = req.params.name;
	const customer = await customerModel.getCustomer({ fName: customer_name });
	console.log(customer)
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

router.post('/', async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await customerModel.createCustomer({
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		phone: req.body.phone,
		isGold: req.body.isGold,
		favoriteGenres: req.body.favoriteGenres
	});
	res.send(customer);
});

router.put('/:id', async (req, res) => {
	const customer_id = req.params.id;
	const customer = await customerModel.updateCustomer(customer_id, {
		fName: req.body.fName,
		lName: req.body.lName,
		email: req.body.email,
		phone: req.body.phone,
		isGold: req.body.isGold,
		favoriteGenres: req.body.favoriteGenres
	})
	if (!customer) return res.status(404).send('Customer not found.');
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	res.send(customer);
});

router.delete('/:id', async (req, res) => {
	const customer_id = req.params.id;
	const customer = await customerModel.deleteCustomer(customer_id);
	if (!customer) return res.status(404).send('Customer not found.');

	res.send(customer);
});

function validateCustomer(customer) {
	const schema = Joi.object({
		fName: Joi.string().min(5).required(),
		lName: Joi.string().min(5).required(),
		email: Joi.string().min(5).required(),
		phone: Joi.string().min(5),
		isGold: Joi.boolean(),
		favoriteGenres: Joi.array().required()
	});
	return schema.validate(customer);
};

module.exports = router;