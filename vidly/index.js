require('express-async-errors');
const express = require('express');
const config = require('config');
const log = require('./middleware/logger');

const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/db')(app);
require('./startup/config')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));