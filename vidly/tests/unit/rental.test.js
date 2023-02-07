const rentalModel = require("../../models/rental");
const genreModel = require("../../models/genre");
const movieModel = require("../../models/movie");
const customerModel = require("../../models/customer");

describe("Rental model", () => {
	let testRental;
	let testCustomer;
	let testGenre;
	let testMovie;

	const setup = () => {
		testGenre = new genreModel.Genre({ "name": "testgenre1"});
		
		testCustomer = new customerModel.Customer({
			"fName": "testbert",
			"lName": "testerson",
			"email": "testbert@gmail.com",
			"favoriteGenres": ["testgenre1", "testgenre2"]
		});
		
		testMovie = new movieModel.Movie({ 
			"title": "testmovie1", 
			"genreId": testGenre._id
		});

	};

	it("should return a Rental object if we send valid fields.", () => {
		setup();
		const testRental1 = new rentalModel.Rental({
			"customer": testCustomer._id,
			"movie": testMovie._id
		});
		expect(testRental1).toHaveProperty("customer");
		expect(testRental1).toHaveProperty("movie");
		expect(testRental1).toHaveProperty("_id");
		expect(testRental1).toHaveProperty("isOverdue");
		expect(testRental1).toHaveProperty("rentalDate");
		expect(testRental1).toHaveProperty("rentalDuration");
	})
});
describe("validateRental", () => {
	let testCustomer;
	let testGenre;
	let testMovie;
	let testRental

	const setup = () => {
		testGenre = new genreModel.Genre({ "name": "testgenre1"});
		testCustomer = new customerModel.Customer({
			"fName": "testbert",
			"lName": "testerson",
			"email": "testbert@gmail.com",
			"favoriteGenres": ["testgenre1", "testgenre2"]
		});
		testMovie = new movieModel.Movie({ 
			"title": "testmovie1", 
			"genreId": testGenre._id
		});
		testRental = {
			"customer": testCustomer._id.toHexString(),
			"movie": testMovie._id.toHexString()
		}
	};

	it("should return a Rental object if we send valid fields.", async () => {
		setup();
		const res = await rentalModel.validateRental(testRental);
		expect(res).not.toHaveProperty("error")
	});
	it("should return an error if we send invalid customer Id.", async () => {
		setup();
		testRental.customer = 6
		const res = await rentalModel.validateRental(testRental);
		expect(res).toHaveProperty("error");
	});
	it("should return an error if we send invalid movie Id.", async () => {
		setup();
		testRental.movie = 6
		const res = await rentalModel.validateRental(testRental);
		expect(res).toHaveProperty("error");
	});
	
});