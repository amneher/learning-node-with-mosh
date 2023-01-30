const movieModel = require('../../models/movie');
const genreModel = require('../../models/genre');

describe("movieModel", () => {
	
	beforeEach(() => {
		testGenre = new genreModel.Genre({ "name": "testGenre1" });
	});

	it("should return a movie object with all the correct fields.", () => {
		info = {
			"title": "testmovie1",
			"genre": { "_id": testGenre._id, "isActive": true },
			"numberInStock": 23,
			"dailyRentalRate": 3
		}
		const movie = new movieModel.Movie(info);
		expect(movie).toMatchObject(info);
	});
});

describe("validateMovie", () => {
	let testMovie;

	beforeEach(() => {
		testMovie = {
			"title": "testmovie1",
			"genreId": "63d7d8bac31f703f4e2b0099",
			"numberInStock": 22,
			"dailyRentalRate": 3
		}
	});
	
	it("should not return an error if we send valid data", async () => {
		const res = movieModel.validateMovie(testMovie);
		expect(res).not.toHaveProperty("error");
	});
	it("should return an error if we send an invalid title", async () => {
		testMovie.title = "i"
		const res = movieModel.validateMovie(testMovie);
		expect(res).toHaveProperty("error");
		expect(res.error.details[0].type).toBe("string.min");
	});
	it("should return an error if we send an invalid genreId", async () => {
		testMovie.genreId = "i"
		const res = movieModel.validateMovie(testMovie);
		expect(res).toHaveProperty("error");
		expect(res.error.details[0].type).toBe("string.pattern.name");
	});
	it("should return an error if we send an invalid numberInStock", async () => {
		testMovie.numberInStock = "i"
		const res = movieModel.validateMovie(testMovie);
		expect(res).toHaveProperty("error");
	});
	it("should return an error if we send an invalid dailyRentalRate", async () => {
		testMovie.dailyRentalRate = "i"
		const res = movieModel.validateMovie(testMovie);
		expect(res).toHaveProperty("error");
	});
});