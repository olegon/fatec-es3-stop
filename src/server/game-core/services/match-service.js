const constants = require('./constants');

module.exports = service;

const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const TIME_STEP_IN_MS = 1000;

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function service (PubSub) {
    PubSub.subscribe(constants.ROOM_CREATE_MESSAGE, (msg, room) => {
        prepareMatch(PubSub, room);
    });

    PubSub.subscribe(constants.MATCH_STARTED_MESSAGE, (msg, { room, match }) => {
        startMatch(PubSub, room, match);
    });
}

function prepareMatch(PubSub, room) {
    console.log(`# preparing new match for room: ${room.dbRoom._id}`);
    
    const match = {
        currentRound: 0,
        rounds: 5,
        players: [],
        waitingPlayers: [...room.players]
    };

    PubSub.subscribe(constants.ROOM_PLAYER_JOIN_MESSAGE, (msg, { player, room: destinationRoom }) => {
        if (room === destinationRoom) {
            match.waitingPlayers.push(player);

            if (room.status === constants.ROOM_STATUS_WAITING_FOR_PLAYERS && match.waitingPlayers.length >= 2) {
                room.status = constants.ROOM_STATUS_RUNNING;

                match.players = match.waitingPlayers;
                match.waitingPlayers = [];

                PubSub.publish(constants.MATCH_STARTED_MESSAGE, {
                    room,
                    match
                });
            }
        }
    });

    PubSub.subscribe(constants.ROOM_PLAYER_LEFT_MESSAGE, (msg, { player, room: originRoom }) => {
        if (room === originRoom) {
            const playerIndex = match.players.indexOf(player);

            if (playerIndex > -1) {
                match.players.splice(playerIndex, 1);
            }

            const waitingPlayerIndex = match.waitingPlayers.indexOf(player);

            if (waitingPlayerIndex > -1) {
                match.waitingPlayers.splice(waitingPlayerIndex, 1);
            }
        }
    });

}

async function startMatch(PubSub, room, match) {
    console.log('# start match');
    
    match.players.forEach(player => {
        const { socket } = player;

        socket.emit('new_match', {
            players: match.players.map(player => player.socket.id),
            waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
        });
    });

    while (match.currentRound <= match.rounds) {
        match.currentRound += 1
        
        console.log(`# starting round ${match.currentRound}`);

        await delay(5000);

        console.log(`# ending round ${match.currentRound}`);
    }
    
    console.log('# ending match');
}

function delay(timeout) {
    return new Promise(res => {
        setTimeout(res, timeout, timeout);
    });
}


