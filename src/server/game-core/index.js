const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = function (app, server, PubSub) {
    const {
        Room: RoomModel,
        Word: WordModel,
        GameParameters: GameParametersModel,
        SuggestedWord: SuggestedWordModel
    } = require('../api/models');

    const dbRoomService = require('../services/room-service')(RoomModel);
    const dbWordService = require('../services/word-service')(WordModel);
    const dbSuggestedWordService = require('../services/suggested-word-service')(SuggestedWordModel);
    const dbGameParametersService = require('../services/gameparameters-service')(GameParametersModel);

    const playerService = require('./services/player-service')(PubSub);
    const wordService = require('./services/word-service')(dbWordService, dbSuggestedWordService);
    const roomService = require('./services/room-service')(PubSub, dbRoomService, playerService);
    const roundService = require('./services/round-service')(PubSub, wordService, playerService);
    const matchService = require('./services/match-service')(PubSub, dbGameParametersService, roundService);

    const io = socketIO(server);

    app.use('/public', express.static(path.join(__dirname, '../../client/public')));
    app.use(cookieParser('#shdadh$xxs'))
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/login.html'));
    });

    app.post('/login', (req, res) => {
        res.cookie('userName', req.body.name);
        res.redirect('/');
    });

    app.use((req, res, next) => {
        if (req.cookies.userName == null || req.cookies.userName === '') {
            res.redirect('/login');
        }
        else {
            next();
        }
    });

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
        cookieParser()(socket.request, socket.response, () => {});

        const { userName } = socket.request.cookies;
        
        const { id } = socket;

        playerService.connect(socket, userName);

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