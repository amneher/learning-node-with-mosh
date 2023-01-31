require('express-async-errors');
const express = require('express');
const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/db')(app);
require('./startup/config')(app);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;