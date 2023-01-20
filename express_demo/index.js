const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

const courses = [
	{ id: 1, name: 'ExpressJS'},
	{ id: 2, name: 'ReactJS'},
	{ id: 3, name: 'Python'},
	{ id: 4, name: 'MongoDB'},
	{ id: 5, name: 'Postgresql'},
	{ id: 6, name: 'VueJS'}
];

app.get("/", (req, res) => {
	res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	const course_id = req.params.id;
	const course = courses.find(c => c.id === parseInt(course_id))
	if (!course) return res.status(404).send('Course not found.')
	console.log(courses);
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	// console.log(result);
	const course = {
		id: courses.length + 1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
	const course_id = req.params.id;
	const course = courses.find(c => c.id === parseInt(course_id))
	if (!course) return res.status(404).send('Course not found.');
		
	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	course.name = req.body.name;
	console.log(courses);
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	const course_id = req.params.id;
	const course = courses.find(c => c.id === parseInt(course_id))
	if (!course) return res.status(404).send('Course not found.');

	const index = courses.indexOf(course);
	courses.splice(index, 1);
	console.log(courses);
	res.send(courses);
});

function validateCourse(course) {
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	});
	return schema.validate(course);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));