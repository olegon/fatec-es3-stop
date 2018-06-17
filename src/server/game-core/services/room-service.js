const events = require('events');
const util = require('../util');

const messages = require('./messages-definition');

module.exports = service;

function service(PubSub, dbRoomService, playerService) {
    const runningRooms = {};

    PubSub.subscribe(messages.PLAYER_DISCONNECTED_MESSAGE, function (msg, player) {
        Object.entries(runningRooms)
        .forEach(([roomId, room]) => {
            for (let roomPlayer of room.players) {
                if (roomPlayer == player) {
                    PubSub.publish(messages.ROOM_PLAYER_LEFT_MESSAGE, {
                        player,
                        room
                    });
                }
            }
        });
    });

    return {
        async join(socket, parameters) {
            const { id } = socket;
            const { roomId } = parameters;

            console.log(`# player ${id} wants to join room ${roomId}`);

            const dbRoom = await dbRoomService.getRoomById(roomId);

            const player = playerService.getPlayerBySocket(socket);
           
            if (player == null) {
                return;
            }

            if (dbRoom == null) {
                handleRoomNotFound(player.socket);
            }
            else if (!dbRoom.active) {
                handleRoomNotActive(player.socket, dbRoom)
            }
            else {
                handleRoomFound(PubSub, player, dbRoom, runningRooms);
            }
        }
    }
}

function handleRoomNotFound(socket) {
    socket.emit('room_not_found', {});
}

function handleRoomNotActive(socket, dbRoom) {
    const roomToEmit = {
        _id: dbRoom._id,
        name: dbRoom.name
    };

    socket.emit('room_not_active', {
        room: roomToEmit
    });
}

function handleRoomFound(PubSub, player, dbRoom, roomsInGame) {
    const { _id: roomId } = dbRoom;

    if (roomId in roomsInGame) {
        const roomInGame = roomsInGame[roomId];

        joinRoom(PubSub, player, roomInGame);
    }
    else {
        const roomInGame = startNewRoom(PubSub, dbRoom);

        roomsInGame[roomId] = roomInGame;

        joinRoom(PubSub, player, roomInGame);
    }

    const roomInGame = roomsInGame[roomId];

    const playersToEmit = roomInGame.players
        .map(player => ({
            playerId: player.socket.id,
            points: 0
        }));

    const roomToEmit = {
        _id: dbRoom._id,
        name: dbRoom.name,
        categories: dbRoom.categories,
        playerId: player.socket.id,
        players: playersToEmit
    };

    player.socket.emit('room_found', {
        room: roomToEmit
    });
}

function startNewRoom (PubSub, dbRoom) {
    const room = {
        dbRoom,
        players: [],
        points: {}
    };

    PubSub.publish(messages.ROOM_CREATE_MESSAGE, room);

    return room;
}

function joinRoom(PubSub, player, room) {
    room.players.push(player);

    PubSub.publish(messages.ROOM_PLAYER_JOIN_MESSAGE, {
        player,
        room
    });
}