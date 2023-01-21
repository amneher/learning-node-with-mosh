const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: {
    type: [ authorSchema ],
    required: true
  }
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

// Find and Update
async function updateAuthor(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = "Wesley Snipes";
  course.save();  // NOT course.author.save(), doesn't exist.
}

// Update in place
async function updateAuthor(courseId) {
  const course = await Course.updateOne({ _id: courseId }, {
    $set: {
      'author.name': 'Janet Snakehole'
    }
    // $unset: {
    //   'author': ''
    // }
  });
}

// updateAuthor("63cace2c31fa6e01cf274e99");
createCourse('Node Course', [ new Author({ name: 'Mosh' }), new Author({ name: 'Josh' }), new Author({ name: 'Tosh' }) ]);
