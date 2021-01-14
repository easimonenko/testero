#!/usr/bin/env node

"use strict"

/**
 * Module dependencies.
 */

const debug = require('debug')('testero:server')
const http = require('http')

const cfg = require('../configuration').getConfiguration()

/**
 * Get port from configuration or environment and store in Express.
 */

const port = normalizePort(cfg.port || process.env.PORT || '3000');

require('../settings').getSettings().then(settings => {
  /**
   * Create HTTP server.
   */
  const app = require('../app')(settings)
  app.set('port', port);

  const server = http.createServer(app);

  server.on('error', onError);

  server.on('listening', onListening);

  server.on('close', () => {
    console.log("Close connection to database.")
    console.log("Close server.")
    client.close()
  })

  console.log('Server started...')
  server.listen(port)

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
