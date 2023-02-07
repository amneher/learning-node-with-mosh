const mongoose = require('mongoose');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { Return } = require('../../models/return');
const { User } = require('../../models/user');

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
        customerId = mongoose.Types.ObjectId().toHexString();
        movieId = mongoose.Types.ObjectId().toHexString();

        testRental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "1234567890"
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });
        testRentalId = testRental._id.toHexString();
        await testRental.save();
    });
    afterEach( async () => {
        server.close();
        await Return.remove({});
        await Rental.remove({});
    });

    it("the test rental should be saved in the db.", async () => {
        const testRental = await Rental.findById(testRentalId);
        expect(testRental._id.toHexString()).toBe(testRentalId);
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
        it("should not return a Return object if we send an invalid Id.", async () => {
            await testReturn.save();
            const randomId = new mongoose.Types.ObjectId().toHexString();
			const res = await request(server)
                .get('/api/returns/' + randomId)
                .set('x-auth-token', token);
			expect(res.status).toBe(400);
        });
    });
});