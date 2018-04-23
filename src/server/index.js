const http = require('http');
const express = require('express');
const debug = require('debug')('node:server');

const apiSetup = require('./api');
const gameCoreSetup = require('./game-core');


if (process.env.PORT == null) {
    throw new Error('Cannot find enviroment variable PORT');
}

const app = express();
const server = http.createServer(app);

gameCoreSetup(app, server);
apiSetup(app, server);

server.listen(process.env.PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

    switch(error.code) {
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

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr 
        : 'port ' + addr.port

    debug('Listening on: ' + addr);
}




