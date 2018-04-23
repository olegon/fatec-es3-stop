const http = require('http');
const app = require('../app');
const socketIO = require('socket.io');
const debug = require('debug')('node:server');

const port = normalizePort(process.env.PORT || 8080);
const server = http.createServer(app);

app.set('port', port);

const io = socketIO(server);

const playerService = require('../services/player-service')();
const wordService = require('../services/word-service')();
const gameService = require('../services/game-service')(playerService, wordService);

io.on('connection', (socket) => {
    const { id } = socket;
    console.log(`# user connected: ${id}`);
    
    playerService.connect(socket);

    const players = playerService.getPlayers();
    console.log('# connected users:');
    players.forEach(user => {
        console.log(`\t${user.id}`)
    });

    socket.on('disconnect', function(){
        playerService.disconnect(socket);
        console.log('# user disconnected');
    });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('Servidor rodando na porta: ' + port);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if(isNaN(port)) {
        return val;
    }

    if(port >= 0) {
        return port;
    }

    return false;
}

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
    debug('Listen on: ' + addr);
    gameService.initMatch();
}
