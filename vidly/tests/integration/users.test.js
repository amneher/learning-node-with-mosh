const request = require('supertest');
const winston = require('winston');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

describe('/api/users', () => {
	let server;
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		await server.close(); 
		await User.deleteMany({});
	});

	describe('GET /', () => {
		it('should return a list of all users.', async () => {
			await User.collection.insertMany([
				{		
					name: "Billy Shears",
					email: "billy@sgtpepperslonelyheartsclubband.com",
					password: "maxwell's silver hammer"
				},
				{
					name: "Sergeant Pepper",
					email: "sgt@sgtpepperslonelyheartsclubband.com",
					password: "strawberry fields"
				}
			]);
			const res = await request(server).get('/api/users/')
			expect(res.status).toBe(200);
		});
	});

	describe('GET /me', () => {
		let token;
		beforeEach( async () => {
			const user = new User({
				name: "Sergeant Pepper",
				email: "sgt@sgtpepperslonelyheartsclubband.com",
				password: "strawberry fields"
			});
			await user.save();
			token = user.generateAuthToken();
		});
		const exec = async () => {
			return await request(server)
				.get('/api/users/me')
				.set('x-auth-token', token)
		}
		it('should return a successful response if we send a valid token.', async () => {
			const res = await exec();
			expect(res.status).toBe(200);
		});
		it('should return an unsuccessful response if we send an invalid token.', async () => {
			token = new mongoose.Types.ObjectId().toHexString();
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});

	describe("POST /", () => {
		let token;
		let postData;

		beforeEach( async () => {
			token = new User().generateAuthToken();
		});
		const exec = async () => {
			return await request(server)
				.post('/api/users/')
				.set('x-auth-token', token)
				.send(postData);
		}

		it("should return 200 and a token if we send valid data.", async () => {
			postData = {
				name: "Sergeant Pepper",
				email: "sgt@sgtpepperslonelyheartsclubband.com",
				password: "S7rawberry fields"
			}
			const res = await exec();
			expect(res.status).toBe(200);
		});
		it("should return 400 and an error if we send an invalid email.", async () => {
			postData = {
				name: "Sergeant Pepper",
				email: "g@s.c",
				password: "S7rawberry fields"
			}
			const res = await exec();
			// console.log(res.text);
			expect(res.status).toBe(400);
			expect(res.text).toBe('"email" must be a valid email')
		});
		it("should return 400 and an error if we send an invalid name.", async () => {
			postData = {
				name: "P",
				email: "sgt@sgtpepperslonelyheartsclubband.com",
				password: "S7rawberry fields"
			}
			const res = await exec();
			// console.log(res.text);
			expect(res.status).toBe(400);
			expect(res.text).toBe('"name" length must be at least 2 characters long')
		});
		it("should return 400 and an error if we send an invalid password.", async () => {
			postData = {
				name: "Sergeant Paul Percival Peter Pepper III",
				email: "sgt@sgtpepperslonelyheartsclubband.com",
				password: "strawberry fields"
			}
			const res = await exec();
			// console.log(res.body);
			expect(res.status).toBe(400);
			expect(res.body.details[0].type).toBe('passwordComplexity.uppercase');
			expect(res.body.details[1].type).toBe('passwordComplexity.numeric');
		});
	});

	describe("PUT /:id", () => {
		let token;
		let putData;
		let user;
		let userId;

		beforeEach( async () => {
			user = new User({
				name: "Sergeant Pepper",
				email: "sgt@sgtpepperslonelyheartsclubband.com",
				password: "strawberry fields"
			});
			await user.save();
			token = user.generateAuthToken();
			userId = user._id.toHexString();
		});
		const exec = async () => {
			return await request(server)
				.put(`/api/users/${userId}`)
				.set('x-auth-token', token)
				.send(putData);
		}
		it('should return a successful response if we send a valid token, userId, and putData.', async () => {
			putData = {
				name: "sergeant paul percival peter pepper iii"
			}
			const res = await exec();
			expect(res.body.name).toBe(putData.name);
			expect(res.status).toBe(200);
		});
		it('should return an error if we send an invalid userId.', async () => {
			putData = {
				name: "sergeant paul percival peter pepper iii"
			}
			userId = "starfish";
			const res = await exec();
			// console.log(res.text);
			expect(res.text).toBe("Invalid User Id.");
			expect(res.status).toBe(400);
		});
	});
});