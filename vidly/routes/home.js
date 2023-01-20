const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {title: 'Vidly', message: 'Documentaries are great!'});
});

module.exports = router;