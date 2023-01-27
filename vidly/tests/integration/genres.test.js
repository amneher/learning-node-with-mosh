const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('/api/genres', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		server.close(); 
		await Genre.remove({});
	});

	describe('GET /', () => {
		it('should return all genres', async () => {
			await Genre.collection.insertMany([
				{ name: "testGenre1" },
				{ name: "testGenre2" }
			]);
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(g => g.name === 'testGenre1')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('should return the genre with the given Id', async () => {
			let testGenre1 = new Genre({ name: "testGenre1"	});
			await testGenre1.save();
			const res = await request(server).get(`/api/genres/${ testGenre1._id }`);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty( 'name', testGenre1.name );
		});
		it('should return 404 if we do not send a valid Id', async () => {
			const res = await request(server).get(`/api/genres/byId/1`);
			expect(res.status).toBe(404);
		});
		it('should return 404 if a genre is not found', async () => {
			const badId = mongoose.Types.ObjectId();
			const res = await request(server).get(`/api/genres/byId/${badId}`);
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		// Define the happy path, then change one parameter in each test that
		// clearly aligns with the test's name.

		let token;
		let name;
		const exec = async () => {
			return await request(server)
				.post('/api/genres/')
				.set('x-auth-token', token)
				.send({ name: name });
		}

		beforeEach(() => {
			token = new User().generateAuthToken();
			name = 'testgenre1';
		});

		it('should save the genre object if it is valid.', async () => {
			const res = await exec();
			expect(res.status).toBe(200); 
			const genre = await Genre.find({ name: 'testgenre1' });
			expect(genre).not.toBeNull();
		});
		it('should return the genre object in the response body if it is valid.', async () => {
			const res = await exec();
			expect(res.status).toBe(200); 
			expect(res.body).toHaveProperty('name', 'testgenre1');
			expect(res.body).toHaveProperty('_id');
		});
		it('should return a 400 if we send a short name.', async () => {
			name = 'no';
			const res = await exec();
			expect(res.status).toBe(400); 
		});
		it('should return a 400 if we send a long name.', async () => {
			name = new Array(52).join('a');
			const res = await exec();
			expect(res.status).toBe(400); 
		});
		it("should return a 401 if we aren't logged in.", async () => {
			token = '';
			const res = await exec();
			expect(res.status).toBe(401); 
		});
	});

	describe('PUT /:id', () => {
		let token;
		let testGenre1_id;
		let payload;

		beforeEach(async () => {
			token = new User().generateAuthToken();
		});

		const exec = async () => {
			return await request(server)
				.put(`/api/genres/${ testGenre1_id }`)
				.set('x-auth-token', token)
				.send(payload);
		}

		it('should return a genre object if we both found the object and updated successfully.', async () => {
			payload = { name: "testGenre1"};
			testGenre1 = new Genre({ name: "testGenre1", isActive: true	});
			await testGenre1.save();
			testGenre1_id = testGenre1._id
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name');
		});

		it('should return 404 if we sent an invalid Id.', async () => {
			testGenre1_id = new mongoose.Types.ObjectId();
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should return 400 if we sent an invalid payload.', async () => {
			testGenre1 = new Genre({ name: 'regularName', isActive: true });
			await testGenre1.save();
			testGenre1_id = testGenre1._id
			payload = { roger: false, stan: true }
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});

	describe('DELETE /:id', () => {
		let token;
		let testGenre1_id;

		beforeEach(async () => {
			token = new User({isAdmin: true}).generateAuthToken();
			testGenre1 = new Genre({ name: 'testgenre' });
			testGenre1_id = testGenre1._id;
			await testGenre1.save();
		});

		const exec = async () => {
			return await request(server)
				.delete(`/api/genres/${ testGenre1_id }`)
				.set('x-auth-token', token);
		}

		it('should return successfully if we send a valid Id and are logged in.', async () => {
			const res = await exec();
			expect(res.status).toBe(200);
		});

		it('should return a 403 if we are not logged in.', async () => {
			token = new User().generateAuthToken();
			const res = await exec();
			expect(res.status).toBe(403);
		});

		it('should return a 404 if we send an invalid Id.', async () => {
			testGenre1_id = 'apple';
			const res = await exec();
			expect(res.status).toBe(404);
		});
	});
});