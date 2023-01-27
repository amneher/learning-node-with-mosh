const request = require('supertest');
const mongoose = require('mongoose');
const { Customer } = require('../../models/customer');
const { User } = require('../../models/user');


describe('/api/customers', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		server.close(); 
		await Customer.remove({});
	});

	describe('GET /', () => {
		it('should return a list of all customers.', async () => {
			await Customer.collection.insertMany([
				{		
					fName: "Billy",
					lName: "Shears",
					email: "billy@sgtpepperslonelyheartsclubband.com",
					favoriteGenres: ["cartoon", "anime", "comedy"]
				},
				{
					fName: "Sergeant",
					lName: "Pepper",
					email: "sgt@sgtpepperslonelyheartsclubband.com",
					favoriteGenres: ["cartoon", "anime", "comedy"]
				}
			]);
			const res = await request(server).get('/api/customers/')
			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		it('should return a customer object.', async () => {
			const customer = new Customer({		
					fName: "Billy",
					lName: "Shears",
					email: "billy2@sgtpepperslonelyheartsclubband.com",
					favoriteGenres: ["cartoon", "anime", "comedy"]
				});
			await customer.save();
			const res = await request(server).get('/api/customers/' + customer._id)
			expect(res.status).toBe(200);
		});
	});
});