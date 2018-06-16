const events = require('events');
const util = require('../util');

module.exports = service;

function service(playerService, dbRoomService) {
    const runningRooms = {};

    playerService.onPlayerDisconnected(function (socket) {
        const { id } = socket;

        console.log(`# player ${id} has been gone`);
    });

    return {
        async join (socket, parameters) {
            const { id } = socket;
            const { roomId } = parameters;
    
            console.log(`# player ${id} wants to join room ${roomId}`);

            const dbRoom = await dbRoomService.getRoomById(roomId);

            if (!dbRoom) {
                socket.emit('room_not_found', {
                });
            }
            else if (!dbRoom.active) {
                socket.emit('room_not_active', {
                });
            }
            else {
                const roomToEmit = {
                    _id: dbRoom._id,
                    name: dbRoom.name,
                    categories: dbRoom.categories
                };

                if (!(roomId in runningRooms)) {
                    runningRooms[roomId] = {

                    }
                }

                socket.emit('room_found', {
                    room: roomToEmit
                });
            }
        }
    }
}