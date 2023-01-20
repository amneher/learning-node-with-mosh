const EventEmitter = require('events');

var url = "http://www.loggins.io/log";

class Logger extends EventEmitter {
  log(message) {
    // Send an HTTP request
    console.log(message);
    // Raise an event
    this.emit('messageLogged', { id: 1, url: url, message: message });
  }
}

module.exports = Logger;
