const request = require('supertest');


describe("Home Page", () => {
	let server;
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		server.close(); 
	});
	it('should return a rendered template.', async () => {
		const res = await request(server).get("/");
		expect(res.status).toBe(200);
	});
});