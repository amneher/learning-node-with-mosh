const mongoose = require('mongoose');
const Joi = require('joi');

function arrayValidator(v) {
	return new Promise((resolve, reject) => {
		const result = v && v.length > 0;
		resolve(result);
	});
}

const customerSchema = new mongoose.Schema({
	fName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	lName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		minLength: 5,
		maxLength: 255
	},
	phone: {
		type: String,
		required: false,
		minLength: 5,
		maxLength: 255
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isGold: {
		type: Boolean,
		default: false
	},
	dateJoined: {
		type: Date,
		default: Date.now
	},
	favoriteGenres: { 
		type: Array,
		// required: true
		validate: [ arrayValidator, "A Customer should have at least one favorite genre." ]
	}
});

const Customer = new mongoose.model('Customer', customerSchema);

async function getAllCustomers() {
	return await Customer.find().sort('fName');
}

async function getCustomerById(id) {
	return await Customer.findById(id);
}

async function getCustomer(data) {
	return await Customer.findOne(data)
		.catch((ex) => {
			for (field in ex.errors) {
			console.log(ex.errors[field])}
		});
}

async function createCustomer(data) {
	const customer = new Customer({
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
	}
}

async function updateCustomer(id, data) {
	const customer = await Customer.findOneAndUpdate(id, data);
	return customer;
}

async function deleteCustomer(id) {
	const customer = await Customer.deleteOne({ _id: id });
	return customer;
}

function validateCustomer(customer) {
	const schema = Joi.object({
		fName: Joi.string().min(5).max(255).required(),
		lName: Joi.string().min(5).max(255).required(),
		email: Joi.string().min(5).max(255).required(),
		phone: Joi.string().min(5).max(255),
		isGold: Joi.boolean(),
		favoriteGenres: Joi.array().required()
	});
	return schema.validate(customer);
};

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.getAllCustomers = getAllCustomers;
module.exports.getCustomerById = getCustomerById;
module.exports.getCustomer = getCustomer;
module.exports.createCustomer = createCustomer;
module.exports.updateCustomer = updateCustomer;
module.exports.deleteCustomer = deleteCustomer;
module.exports.validateCustomer = validateCustomer;