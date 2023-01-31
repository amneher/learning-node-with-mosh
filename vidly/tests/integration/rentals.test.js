const request = require('supertest');
const winston = require('winston');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');
const { Rental } = require('../../models/rental');

describe('/api/rentals', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		server.close(); 
		await Movie.deleteMany({});
		await Genre.deleteMany({});
		await Customer.deleteMany({});
		await Rental.deleteMany({});
	});

	describe("GET /", () => {
		let testMovie;
		let testGenre;
		let testCustomer;
		let testRentalId;
		beforeEach( async () => {
			testGenre = new Genre({ name: "testgenre1" });
			await testGenre.save();
			testMovie = new Movie({ 
				title: "testmovie1", 
				genre: { 
					_id: testGenre._id.toHexString(), 
					name: testGenre.name 
				},
				numberInStock: 12,
				dailyRentalRate: 6
			});
			await testMovie.save();
			testCustomer = new Customer({
				fName: "Testbert",
				lName: "Testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["cartoons", "horror"]
			});
			await testCustomer.save();
			const testRental = new Rental({
				movie: testMovie._id.toHexString(),
				customer: testCustomer._id.toHexString()
			});
			await testRental.save()
			testRentalId = testRental._id.toHexString()
		});
		it("should return 200.", async () => {
			const res = await request(server).get("/api/rentals/");
			expect(res.status).toBe(200);
		});
	});

	describe("GET /:id", () => {
		let testMovie;
		let testGenre;
		let testCustomer;
		let testRentalId;

		beforeEach( async () => {
			testGenre = new Genre({ name: "testgenre1" });
			await testGenre.save();
			testMovie = new Movie({ 
				title: "testmovie1", 
				genre: { 
					_id: testGenre._id.toHexString(), 
					name: testGenre.name 
				},
				numberInStock: 12,
				dailyRentalRate: 6
			});
			await testMovie.save();
			testCustomer = new Customer({
				fName: "Testbert",
				lName: "Testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["cartoons", "horror"]
			});
			await testCustomer.save();
			const testRental = new Rental({
				movie: testMovie._id.toHexString(),
				customer: testCustomer._id.toHexString()
			});
			await testRental.save()
			testRentalId = testRental._id.toHexString()
		});

		it("should return 200 if we send a valid Id.", async () => {
			const res = await request(server).get(`/api/rentals/${testRentalId}`);
			expect(res.status).toBe(200);
		});
		it("should return 400 if we do not send a valid Id.", async () => {
			const res = await request(server).get('/api/rentals/something_not_an_id');
			expect(res.status).toBe(400);
		});
		it("should return 404 if we do not send an Id that doesn't exist.", async () => {
			testRentalId = mongoose.Types.ObjectId().toHexString();
			const res = await request(server).get(`/api/rentals/${testRentalId}`);
			expect(res.status).toBe(404);
		});
	});

	describe("POST / ", () => {
		let testMovie;
		let testGenre;
		let testCustomer;

		beforeEach( async () => {
			token = new User().generateAuthToken();
			testGenre = new Genre({ name: "testgenre1" });
			await testGenre.save();
			testMovie = new Movie({ 
				title: "testmovie1", 
				genre: { 
					_id: testGenre._id.toHexString(), 
					name: testGenre.name 
				},
				numberInStock: 12,
				dailyRentalRate: 6
			});
			await testMovie.save();
			testCustomer = new Customer({
				fName: "Testbert",
				lName: "Testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["cartoons", "horror"]
			});
			await testCustomer.save();
		});

		const exec = async (data) => {
			return await request(server)
				.post('/api/rentals/')
				.set('x-auth-token', token)
				.send(data);
		}

		it("should return 200 if we send valid fields.", async () => {
			const testRental = {
				movie: testMovie._id.toHexString(),
				customer: testCustomer._id.toHexString()
			};
			const res = await exec(testRental);
			expect(res.status).toBe(200);
		});
		it("should return 400 if we send an invalid movie field.", async () => {
			const testRental = {
				movie: "hamburgers",
				customer: testCustomer._id.toHexString()
			};
			const res = await exec(testRental);
			expect(res.status).toBe(400);
		});
		it("should return 404 if we send a nonexistent movie Id.", async () => {
			const badId = new mongoose.Types.ObjectId().toHexString()
			const testRental = {
				movie: badId,
				customer: testCustomer._id.toHexString()
			};
			const res = await exec(testRental);
			expect(res.status).toBe(404);
		});
		it("should return 400 if we send an invalid customer field.", async () => {
			const testRental = {
				movie: testMovie._id.toHexString(),
				customer: "hamburgers"
			};
			const res = await exec(testRental);
			expect(res.status).toBe(400);
		});
		it("should return 404 if we send a nonexistent customer Id.", async () => {
			const badId = new mongoose.Types.ObjectId().toHexString()
			const testRental = {
				movie: testMovie._id.toHexString(),
				customer: badId
			};
			const res = await exec(testRental);
			expect(res.status).toBe(404);
		});
	});

	describe("PUT /:id", () => {
		let testMovie;
		let testGenre;
		let testCustomer;
		let testRentalId;

		beforeEach( async () => {
			token = new User().generateAuthToken();
			testGenre = new Genre({ name: "testgenre1" });
			await testGenre.save();
			testMovie = new Movie({ 
				title: "testmovie1", 
				genre: { 
					_id: testGenre._id.toHexString(), 
					name: testGenre.name 
				},
				numberInStock: 12,
				dailyRentalRate: 6
			});
			await testMovie.save();
			testCustomer = new Customer({
				fName: "Testbert",
				lName: "Testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["cartoons", "horror"]
			});
			await testCustomer.save();
			const testRental = new Rental({
				movie: testMovie._id.toHexString(),
				customer: testCustomer._id.toHexString()
			});
			await testRental.save()
			testRentalId = testRental._id.toHexString()
		});

		const exec = async (data) => {
			return await request(server)
				.put(`/api/rentals/${testRentalId}`)
				.set('x-auth-token', token)
				.send(data);
		}

		it("should return 200 if we send valid data.", async () => {
			const putData = {
				rentalDuration: 12
			}
			const res = await exec(putData);
			expect(res.status).toBe(200);
		});
		it("should return 400 if we send a nonexistent rental Id.", async () => {
			testRentalId = "catdog"
			const putData = {
				rentalDuration: 12
			}
			const res = await exec(putData);
			expect(res.status).toBe(400);
		});
	});

	describe("DELETE /:id", () => {
		let testMovie;
		let testGenre;
		let testCustomer;
		let testRentalId;

		beforeEach( async () => {
			token = new User().generateAuthToken();
			testGenre = new Genre({ name: "testgenre1" });
			await testGenre.save();
			testMovie = new Movie({ 
				title: "testmovie1", 
				genre: { 
					_id: testGenre._id.toHexString(), 
					name: testGenre.name 
				},
				numberInStock: 12,
				dailyRentalRate: 6
			});
			await testMovie.save();
			testCustomer = new Customer({
				fName: "Testbert",
				lName: "Testerson",
				email: "testbert@gmail.com",
				favoriteGenres: ["cartoons", "horror"]
			});
			await testCustomer.save();
			const testRental = new Rental({
				movie: testMovie._id.toHexString(),
				customer: testCustomer._id.toHexString()
			});
			await testRental.save()
			testRentalId = testRental._id.toHexString()
		});

		const exec = async () => {
			// console.log(testRentalId);
			return await request(server)
				.delete(`/api/rentals/${testRentalId}`)
				.set('x-auth-token', token);
		}

		it("should return 200 and a deletedCount of 1 if we send a valid Id.", async () => {
			const res = await exec();
			expect(res.body.deletedCount).toBe(1);
			expect(res.status).toBe(200);
		});
		it("should return 200 and a deletedCount of 0 if we send an invalid Id.", async () => {
			testRentalId = "Lou Ferrigno"
			const res = await exec();
			expect(res.body.deletedCount).toBe(0);
			expect(res.status).toBe(200);
		});

	});
});