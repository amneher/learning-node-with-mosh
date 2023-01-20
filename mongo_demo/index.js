const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
	.then(() => console.log('connected to mongodb...'))
	.catch(err => console.error('could not connect to mongodb ', err));

const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [ String ],
	date: { type: Date, default: Date.now },
	isPublished: Boolean
})

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
	const course = new Course({
		name: 'Angular Course',
		author: 'Mosh',
		tags: ['angular', 'frontend'],
		isPublished: true
	});

	const result = await course.save();
	console.log(result);
}

async function getCourses() {
	// Comparison Query Operators:
	// $eq (equal)
	// $ne (not equal)
	// $gt (greater than)
	// $gte (greater than or equal to)
	// $lt (less than)
	// $lte (less than or equal to)
	// $in (in)
	// $nin (not in)

	// Logical Operators:
	// or
	// and

	// Pagination:
	// use .skip()
	// really, these should be provided in query string params:
	// e.g.  /api/courses?pageNumber=1&pageSize=10
	const pageNumber = 1;
	const pageSize = 10;

	const courses = await Course
		.find({ author: /.*Mosh.*/ })  // .*<string>.* matches strings containing the characters included. 
		// .or([ { tags: { $in: 'angular' }, isPublished: true }, { author: /^Mosh/ }])  // ^ matches strings that start with the following characters.
		.skip((pageNumber - 1) * pageSize)
		.limit(pageSize)
		.sort({ name: 1 })  // 1 for asc or -1 for desc.
		// .select({ name: 1, tags: 1 });
		.count();
	console.log(courses)
}

getCourses();