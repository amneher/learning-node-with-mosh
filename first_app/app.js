// const os = require('os');
// const path = require('path');

const Logger = require("./logger");
const logger = new Logger();

// const fs = require('fs');
// const EventEmitter = require('events');
// const emitter = new EventEmitter();

// function sayHello(name) {
//  var totMem = os.totalmem();
//  var freeMem = os.freemem();
//  console.log(`Total Memory: ${totMem}`);
//  console.log(`Free Memory: ${freeMem}`);
//  var pathObj = path.parse(__filename);
//  logger.log(pathObj);
//  logger.log(name + " says Hello World!");
//    const files = fs.readdirSync('./');
//    logger.log(files);
//    fs.readdir('./', function(err, files) {
//        if (err) logger.log(`Error: ${err}`);
//        else logger.log(`Result: ${files}`);
//    });

// add a Listener
logger.on('messageLogged', function() {
    console.log('Listener called!');
});
logger.log('check one two...');
// Raise an event
// emitter.emit('messageLogged');
// sayHello("Andrew");
