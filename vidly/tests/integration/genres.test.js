const request = require('supertest');
const { Genre } = require('../../models/genre');

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
		});
	})
})