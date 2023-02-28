const request = require('supertest');

jest.setTimeout(20000);

describe("Home Page", () => {
	let server;
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		await server.close(); 
	});
	it('should return a rendered template.', async () => {
		const res = await request(server).get("/");
		expect(res.status).toBe(200);
	});
});