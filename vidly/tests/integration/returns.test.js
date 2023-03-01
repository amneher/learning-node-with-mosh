const request = require('supertest');
const mongoose = require('mongoose');
const { Customer } = require('../../models/customer');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { Rental } = require('../../models/rental');
const { Return } = require('../../models/return');
const { User } = require('../../models/user');

jest.setTimeout(20000);

describe("/api/returns", () => {
    let server;
    let customerId;
    let movieId;
    let testRental;
    let testRentalId;
    let token;

    beforeEach( async () => {
        server = require('../../index');
        token = new User().generateAuthToken();
        const testCustomer = new Customer({
            fName: "12345",
            lName: "67890",
            phone: "1234567890",
            email: "1234567890",
            favoriteGenres: ["anime", "horror"]
        });
        customerId = testCustomer._id.toHexString();
        const testGenre = new Genre({
            name: "testGenre1",
            isActive: true
        });
        const testMovie = new Movie({
            title: "12345",
            dailyRentalRate: 2,
            genre: testGenre,
            numberInStock: 12
        });
        movieId = testMovie._id.toHexString();
        await testMovie.save();
        await testCustomer.save();

        testRental = new Rental({
            customer: customerId,
            movie: movieId,
            rentalDate: Date.parse('2023-01-26T09:29:05-06:00')
        });
        testRentalId = testRental._id.toHexString();
        await testRental.save();
    });
    afterEach( async () => {
        await server.close();
        await Return.deleteMany({});
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await Customer.deleteMany({});
    });

    it("the test rental should be saved in the db.", async () => {
        const testRental2 = await Rental.findById(testRentalId);
        expect(testRental2._id.toHexString()).toBe(testRentalId);
    });

    describe('GET /api/returns/:id', () => {
        const testReturn = new Return({ rental: testRentalId });
        it("should return a Return object if we send a valid Id and token.", async () => {
            await testReturn.save();
			const res = await request(server)
                .get('/api/returns/' + testReturn._id.toHexString())
                .set('x-auth-token', token);
			expect(res.status).toBe(200);
        });
        it("should return a 400 if we send an invalid Id.", async () => {
			const res = await request(server)
                .get('/api/returns/1')
                .set('x-auth-token', token);
			expect(res.status).toBe(400);
        });
        it("should return a 404 if we send a non-existent Id.", async () => {
			const res = await request(server)
                .get('/api/returns/63c9d00139a685728fd30a89')
                .set('x-auth-token', token);
			expect(res.status).toBe(404);
        });
    });

    describe('POST /api/returns/', () => {

        it("should return 200 if we send valid data.", async () => {
            // const testRental2 = await Rental.findById(testRentalId);
            // console.log(testRental2);
            const returnData = {
                rental: testRentalId
            }
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(200);
        });
        it("should return 400 if the rental has already been returned.", async () => {
            // const testRental2 = await Rental.findById(testRentalId);
            // console.log(testRental2);
            const returnData = {
                rental: testRentalId
            }
            // expect this one to succeed.
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(200);
            const r_obj = Rental.findById(testRentalId);
            console.log(r_obj.return)
            // expect this one to fail.
            const res2 = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(400);
        });
        it("should return 400 if we send invalid data.", async () => {
            const returnData = {
                rental: "23"
            }
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(400);
        });
        it("should return 404 if we send an invalid rentalId.", async () => {
            const returnData = {
                rental: mongoose.Types.ObjectId().toHexString()
            }
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(404);
        });
        it("should return 500 if we messed up the data.", async () => {
            const testMovieId = mongoose.Types.ObjectId().toHexString();
            testRental.movie = testMovieId;
            testRental.save();
            const returnData = {
                rental: testRental._id.toHexString()
            }
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(500);
        });
        it("should subtract qty from the movie when Rental is processed, then add qty when Return is processed.", async () => {
            const testRental3 = new Rental({
                    customer: customerId,
                    movie: movieId,
                    rentalDate: Date.parse('2023-01-26T09:29:05-06:00')
                });
            await testRental3.save();
            let testMovie = await Movie.findById(movieId);
            expect(testMovie.numberInStock).toBe(12);
            const returnData = {
                rental: testRental3._id.toHexString(),
                returnDate: Date.parse('2023-02-08T21:35:21.930Z')
            }
            const res = await request(server)
                .post('/api/returns/')
                .set('x-auth-token', token)
                .send(returnData);
            expect(res.status).toBe(200);
            testMovie = await Movie.findById(movieId);
            expect(testMovie.numberInStock).toBe(13);
            const daySecs = 60 * 60 * 24 * 1000;
            let expectedRentalRate = Date.now() - testRental.rentalDate;
		    const duration = (Math.round((expectedRentalRate/daySecs) * 1) / 1);
            expect(res.body.totalRentalFee).toBe(duration * testMovie.dailyRentalRate);
        });
    });
});