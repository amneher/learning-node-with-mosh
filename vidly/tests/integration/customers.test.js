const request = require('supertest');
const winston = require('winston');
const mongoose = require('mongoose');
const { Customer } = require('../../models/customer');
const { User } = require('../../models/user');

jest.setTimeout(20000);

describe('/api/customers', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		server.close(); 
		await Customer.deleteMany({});
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
					favoriteGenres: ["cartoon", "anime", "comedy"],
					phone: "8675309"
				});
			await customer.save();
			const res = await request(server).get('/api/customers/' + customer._id)
			expect(res.status).toBe(200);
		});
		it('should return 404 if we do not send a valid Id', async () => {
			const res = await request(server).get(`/api/customers/byId/1`);
			expect(res.status).toBe(404);
		});
		it('should return 404 if a genre is not found', async () => {
			const badId = mongoose.Types.ObjectId().toHexString();
			const res = await request(server).get(`/api/customers/byId/${badId}`);
			expect(res.notFound).toBeTruthy();
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		// Define the happy path, then change one parameter in each test that
		// clearly aligns with the test's name.

		let token;
		let testCustomer;
		beforeEach(() => {
			testCustomer = {
				"fName": "testbert",
				"lName": "testerson",
				"email": "testbert@gmail.com",
				"favoriteGenres": ["scifi", "anime"],
				"phone": "8675309",
				"isGold": true
			}
		});
		const exec = async () => {
			return await request(server)
				.post('/api/customers')
				.set('x-auth-token', token)
				.send(testCustomer);
		}

		beforeEach(() => {
			token = new User().generateAuthToken();
		});

		it("should return a Customer object if we send all req'd fields.", async () => {
			const res = await exec();
			expect(res.status).toBe(200);
		});
		it("should return an error if we don't send fName.", async () => {
			testCustomer.fName = "";
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return an error if we don't send lName.", async () => {
			testCustomer.lName = "";
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return an error if we don't send email.", async () => {
			testCustomer.email = "";
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return an error if we don't send favoriteGenres.", async () => {
			testCustomer.favoriteGenres = [];
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return an error if we don't send a valid phone.", async () => {
			testCustomer.phone = "83";
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return an error if we don't send a valid isGold bool.", async () => {
			testCustomer.isGold = "Y";
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});

	describe('PUT /:id', () => {
		let token;
		let testCustomer1_id;
		let payload;

		beforeEach(async () => {
			token = new User().generateAuthToken();
		});

		const exec = async () => {
			return await request(server)
				.put(`/api/customers/${ testCustomer1_id }`)
				.set('x-auth-token', token)
				.send(payload);
		}

		it('should return a customer object if we both found the object and updated successfully.', async () => {
			testCustomer1 = new Customer({ 
				fName: "testward",
				lName: "testerson",
				email: "testward@gmail.com",
				favoriteGenres: ["horror", "romcom"]	
			});
			await testCustomer1.save();
			testCustomer1_id = testCustomer1._id
			payload = { 
				fName: "testbert",
				lName: "testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["horror", "romcom"]
			};
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('fName');
		});

		it("should return 400 if we send an invalid Id.", async () => {
			testCustomer1_id = "richard pryor";
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});

	describe('DELETE /:id', () => {
		let token;
		let testCustomer1_id;

		beforeEach(async () => {
			token = new User().generateAuthToken();
		});

		const exec = async () => {
			return await request(server)
				.delete(`/api/customers/${ testCustomer1_id }`)
				.set('x-auth-token', token);
		}

		it('should return a customer object if we both found the object and updated successfully.', async () => {
			testCustomer1 = new Customer({ 
				fName: "testward",
				lName: "testerson",
				email: "testward@gmail.com",
				favoriteGenres: ["horror", "romcom"]	
			});
			await testCustomer1.save();
			testCustomer1_id = testCustomer1._id
			const res = await exec();
			expect(res.status).toBe(200);
		});

		it("should return 400 if we send an invalid Id.", async () => {
			testCustomer1_id = "richard pryor";
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});
});