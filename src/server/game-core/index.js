const path = require('path');
const express = require('express');
const socketIO = require('socket.io');



module.exports = function (app, server, PubSub) {
    const { Room: RoomModel } = require('../api/models');
    const dbRoomService = require('../services/room-service')(RoomModel);

    const playerService = require('./services/player-service')();
    const wordService = require('./services/word-service')();
    const gameService = require('./services/game-service')(playerService, wordService);
    const roomService = require('./services/room-service')(playerService, dbRoomService);

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

    app.get('/game/:roomId', async (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/game.html'));
    });

    app.get('/new-game', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/new-game.html'));
    });

    io.on('connection', (socket) => {
        const { id } = socket;

        console.log(`# user connected: ${id}`);

        playerService.connect(socket);

        socket.on('join_room', (data) => {
            roomService.join(socket, data);
        });

        // console.log('# connected users:');
        // const players = playerService.getPlayers();
        // players.forEach(user => {
        //     console.log(`\t${user.id}`)
        // });

        socket.on('disconnect', function () {
            playerService.disconnect(socket);
            console.log(`# user disconnected: ${id}`);
        });
    });

    server.on('listening', () => {
        gameService.initMatch();
    });
}