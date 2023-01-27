const genreModel = require('../../models/genre');

describe('Genre model', () => {
	it('should return a genre object if we include the right fields', () => {
		let genreObj = {
			name: "test",
			isActive: true
		}
		const valid = genreModel.validateGenre(genreObj);
		expect(valid).toMatchObject({"value": { "name": "test", "isActive": true }})
	});
});