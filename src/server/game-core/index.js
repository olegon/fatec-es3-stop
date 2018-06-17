const path = require('path');
const express = require('express');
const socketIO = require('socket.io');



module.exports = function (app, server, PubSub) {
    const {
        Room: RoomModel,
        Word: WordModel
    } = require('../api/models');
    const dbRoomService = require('../services/room-service')(RoomModel);
    const dbWordService = require('../services/word-service')(WordModel);

    const playerService = require('./services/player-service')(PubSub);
    const wordService = require('./services/word-service')();
    const roomService = require('./services/room-service')(PubSub, dbRoomService, playerService);
    const matchService = require('./services/match-service')(PubSub, roomService);

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

        playerService.connect(socket);

        socket.on('join_room', (data) => {
            roomService.join(socket, data);
        });

        socket.on('disconnect', function () {
            playerService.disconnect(socket);
        });
    });

    server.on('listening', () => {
        
    });
}