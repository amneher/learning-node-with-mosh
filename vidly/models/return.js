const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Movie } = require('./movie');
const { Customer } = require('./customer');
const { Rental } = require('./rental');

const returnSchema = new mongoose.Schema({
	rental: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Rental'
	},
	returnDate: {
		type: Date,
		default: Date.now
	},
	totalRentalFee: {
		type: Number,
		default: 0,
		min: 0,
		max: 255
	}
});

const Return = new mongoose.model('Return', returnSchema);

function validateReturn(returnObj) {
	const schema = Joi.object({
		rental: Joi.objectId().required(),
	});
	return schema.validate(returnObj);
};

module.exports.Return = Return;
module.exports.validateReturn = validateReturn;