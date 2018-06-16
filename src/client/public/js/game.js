(function () {
    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);
    
    const socket = io();

    socket.emit('join_room', {
        roomId
    });

    socket.on('room_found', (data) => {
        console.log('room_found', data);
    });

    socket.on('room_not_found', (data) => {
        console.log('room_not_found', data);
    });

    socket.on('room_not_active', (data) => {
        console.log('roomt_not_active', data);
    });

    socket.on('server_timer', (data) => {
        console.log('server_timer', data);
    });

    socket.on('new_match', (data) => {
        console.log('new_match', data);
    });

    socket.on('current_match', (data) => {
        console.log('current_match', data);
    });
})();   