const socketIO = require('socket.io');

const playerService = require('./services/player-service')();
const wordService = require('./services/word-service')();
const gameService = require('./services/game-service')(playerService, wordService);

module.exports = function (app, server) {
    const io = socketIO(server);

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

    server.on('listening', () => {
        gameService.initMatch();
    });
}