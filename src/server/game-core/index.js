const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

// const roomService = require('./services/room-service');
const playerService = require('./services/player-service')();
const wordService = require('./services/word-service')();
const gameService = require('./services/game-service')(playerService, wordService);

module.exports = function (app, server) {
    const io = socketIO(server);

    app.use('/public', express.static(path.join(__dirname, '../../client/public')));

    app.get('/logic', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/logic/index.html'));
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });

    app.get('/rooms', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/rooms.html'));
    });

    app.get('/game/:roomId', (req, res) => {
        console.log(req.params);
        
        res.sendFile(path.join(__dirname, '../../client/game.html'));
    });

    app.get('/new-game', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/new-game.html'));
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

    server.on('listening', () => {
        gameService.initMatch();
    });
}