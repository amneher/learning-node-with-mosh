const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
	.then(() => console.log('connected to mongodb...'))
	.catch(err => console.error('could not connect to mongodb ', err));

function arrayValidator(v) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// yada yada async stuff...
			const result = v && v.length > 0;
			resolve(result);
	}, 1000);
	});
}

const courseSchema = new mongoose.Schema({
	name: { type: String, required: true },
	author: { type: String, required: true },
	tags: { 
		type: Array,
		// required: true
		validate: [ arrayValidator, "A Course should have at least one tag." ]
	},
	date: { type: Date, default: Date.now },
	isPublished: { type: Boolean, default: false },
	price: { 
		type: Number,
		required: function() { return this.isPublished; } 
	}
})

const Course = mongoose.model('Course', courseSchema);

async function createCourse(name, author, price, tags) {
	const course = new Course({
		name: name,
		author: author,
		price: price,
		tags: tags,
		isPublished: true
	});
	try {
		const result = await course.save();
		console.log(result);
	}
	catch (ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field]);
		}
		// console.log(ex.message)
	}
	// if (result) {
	// 	console.log(result);
	// }
}

createCourse('Python', 'Andrew', 20, []);