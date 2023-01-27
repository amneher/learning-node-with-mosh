const customerModel = require('../../models/customer');

describe('validateCustomer', () => {
	it('should return validated object if all fields are entered correctly', () => {
		let testCustomer_good = {
			fName: 'testbert',
			lName: 'testerson',
			email: 'testbert@gmail.com',
			phone: '5554443333',
			isGold: true,
			favoriteGenres: ['comedy', 'horror', 'documentary']
		}
		const good_result = customerModel.validateCustomer(testCustomer_good);
		expect(good_result).toStrictEqual({"value": testCustomer_good});
	});

	it("should return an error if we don't send any genres", () => {
		let testCustomer_bad = {
			fName: 'testbert',
			lName: 'testerson',
			email: 'testbert@gmail.com',
			phone: '5554443333',
			isGold: true,
			favoriteGenres: []
		}
		const bad_result = customerModel.validateCustomer(testCustomer_bad);
		expect(bad_result).toStrictEqual({"value": testCustomer_bad});
	});

	it('should return an error if the fname is less than 5 characters.', () => {
		let testCustomer_badder = {
			fName: 'tes',
			lName: 'testerson',
			email: 'testbert@gmail.com',
			phone: '5554443333',
			isGold: true,
			favoriteGenres: []
		}
		const badder_result = customerModel.validateCustomer(testCustomer_badder);
		expect(badder_result).toHaveProperty("error");
	});

	it('should return an error if the lname is less than 5 characters.', () => {
		let testCustomer_badder = {
			fName: 'testbert',
			lName: 'tes',
			email: 'testbert@gmail.com',
			phone: '5554443333',
			isGold: true,
			favoriteGenres: []
		}
		const badder_result = customerModel.validateCustomer(testCustomer_badder);
		expect(badder_result).toHaveProperty("error");
	});

	it('should return an error if the email is less than 5 characters.', () => {
		let testCustomer_badder = {
			fName: 'testbert',
			lName: 'testerson',
			email: 'test',
			phone: '5554443333',
			isGold: true,
			favoriteGenres: []
		}
		const badder_result = customerModel.validateCustomer(testCustomer_badder);
		expect(badder_result).toHaveProperty("error");
	});
});

describe('Customer model', () => {
	let customerObj = {
			fName: "Testward",
			lName: "Testerson",
			email: "testward@gmail.com",
			favoriteGenres: ["thriller", "romcom", "scifi"]
		}
	it("should return a Customer object if we send all the right fields", () => {
		let customer = new customerModel.Customer(customerObj);
		expect(customer).toMatchObject({ 
			"email": "testward@gmail.com", 
			"fName": "testward", 
			"isActive": true, 
			"isGold": false 
		});
	});
});

