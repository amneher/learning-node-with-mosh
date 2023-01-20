const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
	.then(() => console.log('connected to mongodb...'))
	.catch(err => console.error('could not connect to mongodb ', err));

const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [ String ],
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: Number
})

const Course = mongoose.model('Course', courseSchema);

// Exercise 1:
// async function getCourses() {
// 	return await Course
// 		.find({ isPublished: true, tags: { $in: 'backend' }})
// 		.sort('name')  // can also use { name: 1} or -1 '-name' for desc.
// 		.select({ name: 1, author: 1 });  // can also use 'name author'
// }

// Exercise 2:
// async function getCourses() {
// 	return await Course
// 		.find({ isPublished: true, tags: { $in: ['backend', 'frontend'] }})
// 		// .find({ isPublished: true })
// 		// .or([{ tags: 'backend' }, { tags: 'frontend' }])
// 		.sort('-price')  // can also use { name: 1} or -1 '-name' for desc.
// 		.select('name author price');  // can also use 'name author'
// }

// Exercise 3:
// async function getCourses() {
// 	return await Course
// 		.find({ isPublished: true })
// 		.or([ { price: { $gte: 15 } }, { name: /.*by.*/ } ]);
// }

// async function run() {
// 	const courses = await getCourses();
// 	console.log(courses);
// }

// run()

// Updating a document:
// async function updateCourse(id) {
// 	// Query First Approach:
// 	// findById()
// 	// Modify the document
// 	// .save()
// 	// const courses = await Course.find();
// 	// console.log(courses);
// 	// const course = await Course.findById(id);
// 	// console.log(course);
// 	// if (!course) {
// 	// 	console.log(id)
// 	// 	return;
// 	// };
	
// 	// course.isPublished = true;
// 	// course.author = 'Someone Else';
// 	// -- either/or -- 
// 	// course.set({
// 	// 	price: 22,
// 	// 	author: 'Anybody Else'
// 	// });

// 	// Update First Approach:
// 	// Update directly in the db.
// 	// optionally get the updated document.
// 	// const result = await Course.updateOne({ _id: id }, {
// 	const result = await Course.findOneAndUpdate(id, {
// 		// any number of mongodb update operators...
// 		$set: {
// 			author: 'Rocky',
// 			isPublished: true
// 		}
// 	}, { new: true });

// 	// const result = await course.save();
// 	console.log(result);
// }

// updateCourse('63c97c9654417356cb11f7b5');

async function removeCourse(id) {
	Course.deleteOne({ _id: id });
}

removeCourse('63c97c9654417356cb11f7b5');



