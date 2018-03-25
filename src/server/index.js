const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const playerService = require('./player-service')();
const wordService = require('./word-service')();
const matchService = require('./match-service')(playerService, wordService);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});


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

server.listen(process.env.PORT, function () {
    console.log(`# listening at *:${process.env.PORT}`);
    
    gameLoop();
    
    // gameService.startMatch();
});

async function gameLoop() {
    while (true) {
        await matchService.startMatches(5);
    }
}



