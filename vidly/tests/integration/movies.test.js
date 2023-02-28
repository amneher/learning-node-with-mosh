const request = require('supertest');
const winston = require('winston');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');

describe('/api/movies', () => {
	let server;
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		await server.close(); 
		await Movie.deleteMany({});
		await Genre.deleteMany({});
	});

	describe('GET /', () => {
		it('should return a list of all movies.', async () => {
			const genre = new Genre({ "name": "testgenre1"});
			const genreId  = genre._id.toHexString();
			await Movie.collection.insertMany([
				{		
					title: "Billy Shears",
					genreId: genreId
				},
				{
					title: "Desmond",
					genreId: genreId
				}
			]);
			const res = await request(server).get('/api/movies/')
			expect(res.status).toBe(200);
		});
	});
	describe('GET /:id', () => {
		it('should return a movie with the given Id.', async () => {
			const testMovie = new Movie({		
				title: "Billy Shears",
				genre: { "name": "testgenre1" }
			});
			await testMovie.save();
			const testMovieId = testMovie._id.toHexString()
			console.log(testMovie);
			const res = await request(server).get(`/api/movies/${testMovieId}`)
			expect(res.status).toBe(200);
		});
		it('should return 404 if we send a nonexistent Id.', async () => {
			const fakeId = mongoose.Types.ObjectId().toHexString();
			const res = await request(server).get(`/api/movies/${fakeId}`);
			expect(res.status).toBe(404);
		});
		it('should return 400 if we send a nonexistent Id.', async () => {
			const fakeId = "some string";
			const res = await request(server).get(`/api/movies/${fakeId}`);
			expect(res.status).toBe(400);
		});
	});
	describe('POST /', () => {
		let testMovie;
		let token;

		beforeEach(() => {
			token = new User().generateAuthToken();
		});

		const exec = async () => {
			return await request(server)
				.post('/api/movies/')
				.set('x-auth-token', token)
				.send(testMovie);
		}
		it("should return a movie object if we send all req'd fields.", async () => {
			const genre = new Genre({ "name": "testgenre1"});
			await genre.save();
			const genreId  = genre._id.toHexString();
			testMovie = {		
				"title": "Edward Scissorhands",
				"genreId": genreId,
				"numberInStock": 12,
				"dailyRentalRate": 6
			};
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body.title).toBe('edward scissorhands');
			expect(res.body.genre.name).toBe('testgenre1');
		});
		it("should return a 400 if we send a bad movie object.", async () => {
			const genre = new Genre({ "name": "testgenre1"});
			await genre.save();
			const genreId  = genre._id.toHexString();
			testMovie = {		
				"title": "I",
				"genreId": genreId,
				"numberInStock": 12,
				"dailyRentalRate": 6
			};
			const res = await exec();
			expect(res.status).toBe(400);
		});
		it("should return a 400 if we send a bad movie object.", async () => {
			const genre = new Genre({ "name": "testgenre1"});
			// await genre.save();
			const genreId  = genre._id.toHexString();
			testMovie = {		
				"title": "I",
				"genreId": genreId,
				"numberInStock": 12,
				"dailyRentalRate": 6
			};
			const res = await exec();
			expect(res.status).toBe(400);
		});
	});
	describe('PUT /:id', () => {
		let putData;
		let token;
		let testMovieId;

		beforeEach( async () => {
			token = new User().generateAuthToken();
			const genre = new Genre({ "name": "testgenre1"});
			await genre.save();
			const genreId  = genre._id.toHexString();
			const testMovie = new Movie({		
				"title": "Edward Scissorhands",
				"genre": { "_id": genreId, "name": genre.name},
				"numberInStock": 12,
				"dailyRentalRate": 6
			});
			await testMovie.save();
			testMovieId = testMovie._id.toHexString();
		});
		const exec = async () => {
			return await request(server)
				.put(`/api/movies/${testMovieId}`)
				.set('x-auth-token', token)
				.send(putData);
		};
		it('should return 200 if we send auth and the right fields.', async () => {
			putData = {
				title: "Edward Scissorhands II: The Sharpening"
			};
			const res = await exec();
			expect(res.status).toBe(200);
			// console.log(res.body);
			expect(res.body).toHaveProperty("title")
		});
		it('should return 400 if we send a bad movie Id.', async () => {
			putData = {
				title: "Edward Scissorhands II: The Sharpening"
			};
			testMovieId = 'blah'
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.text).toBe("Invalid Movie Id.");
		});
	});
	describe('DELETE /:id', () => {
		let token;
		let testMovieId;

		beforeEach( async () => {
			token = new User().generateAuthToken();
			const genre = new Genre({ "name": "testgenre1"});
			await genre.save();
			const genreId  = genre._id.toHexString();
			const testMovie = new Movie({		
				"title": "Edward Scissorhands",
				"genre": { "_id": genreId, "name": genre.name},
				"numberInStock": 12,
				"dailyRentalRate": 6
			});
			await testMovie.save();
			testMovieId = testMovie._id.toHexString();
		});
		const exec = async () => {
			return await request(server)
				.delete(`/api/movies/${testMovieId}`)
				.set('x-auth-token', token);
		};
		it('should return 200 if we send auth and the right fields.', async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			// console.log(res);
		});
		it('should return 400 if we send a bad movie Id.', async () => {
			testMovieId = 'blah'
			const res = await exec();
			expect(res.status).toBe(400);
			expect(res.text).toBe("Invalid Movie Id.");
		});
		it('should return 401 if we send a bad token.', async () => {
			token = ""
			const res = await exec();
			expect(res.status).toBe(401);
			expect(res.text).toBe("Access denied. Token is required.");
		});
	});
});