const constants = require('./constants');
const {
    internalPlayerRepresentationToSocketRepresentation
} = require('../util');


module.exports = service;

function service(PubSub, dbRoomService, playerService) {
    const runningRooms = {};

    registerToPlayerDisconnetedEvent(PubSub, runningRooms);
    registerToGameDetroyEvent(PubSub, runningRooms);

    return {
        async join(socket, parameters) {
            const { id } = socket;
            const { roomId } = parameters;

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

function registerToPlayerDisconnetedEvent(PubSub, runningRooms) {
    PubSub.subscribe(constants.PLAYER_DISCONNECTED_MESSAGE, function (msg, player) {
        Object.entries(runningRooms)
            .forEach(([roomId, room]) => {
                const playerIndex = room.players.indexOf(player);

                if (playerIndex > -1) {
                    room.players.splice(playerIndex, 1);

                    PubSub.publish(constants.ROOM_PLAYER_LEFT_MESSAGE, {
                        player,
                        room
                    });
                }
            });
    });
}

function registerToGameDetroyEvent (PubSub, runningRooms) {
    PubSub.subscribe(constants.ROOM_DESTROY_MESSAGE, function (msg, { room }) {
        const { dbRoom } = room;
        
        dbRoom.active = false;
        dbRoom.reason = 'O jogo finalizou.';

        dbRoom
        .save()
        .then(console.log)
        .catch(console.error);
    });
}

function handleRoomNotFound(socket) {
    socket.emit('room_not_found', {});
}

function handleRoomNotActive(socket, dbRoom) {
    const roomToEmit = {
        _id: dbRoom._id,
        name: dbRoom.name,
        reason: dbRoom.reason
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
        const roomInGame = startNewRoom(PubSub, player, dbRoom);

        roomsInGame[roomId] = roomInGame;
    }

    const roomInGame = roomsInGame[roomId];

    const playersToEmit = roomInGame.players.map(internalPlayerRepresentationToSocketRepresentation);

    const roomToEmit = {
        _id: dbRoom._id,
        name: dbRoom.name,
        categories: dbRoom.categories,
        playerId: player.socket.id,
        players: playersToEmit,
        status: roomInGame.status
    };

    player.socket.emit('room_found', {
        room: roomToEmit
    });
}

function startNewRoom(PubSub, player, dbRoom) {
    const room = {
        dbRoom,
        players: [ player ],
        status: constants.ROOM_STATUS_WAITING_FOR_PLAYERS
    };

    PubSub.publish(constants.ROOM_CREATE_MESSAGE, room);

    return room;
}

function joinRoom(PubSub, player, room) {
    room.players.push(player);

    PubSub.publish(constants.ROOM_PLAYER_JOIN_MESSAGE, {
        player,
        room
    });
}