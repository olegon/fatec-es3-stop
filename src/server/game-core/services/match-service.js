const constants = require('./constants');

module.exports = service;

const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function service (PubSub, dbGameParametersService, roundService) {
    PubSub.subscribe(constants.ROOM_CREATE_MESSAGE, (msg, room) => {
        prepareMatch(PubSub, dbGameParametersService, room);
    });

    PubSub.subscribe(constants.MATCH_STARTED_MESSAGE, (msg, { room, match }) => {
        startMatch(PubSub, room, match, roundService);
    });
}

async function prepareMatch(PubSub, dbGameParametersService, room) {
    console.log(`# preparing new match for room: ${room.dbRoom._id}`);

    const gameParamaters = await dbGameParametersService.getGameParamaters();

    const match = {
        availableLetters: [...AVAILABLE_LETTERS],
        currentRound: 0,
        rounds:  gameParamaters.roundsByMatch,
        roundDuration: gameParamaters.roundDuration,
        currentPlayers: [],
        waitingPlayers: [...room.players]
    };

    PubSub.subscribe(constants.ROOM_PLAYER_JOIN_MESSAGE, (msg, { player, room: destinationRoom }) => {
        if (room === destinationRoom) {
            match.waitingPlayers.push(player);

            if (room.status === constants.ROOM_STATUS_WAITING_FOR_PLAYERS && match.waitingPlayers.length >= 2) {
                room.status = constants.ROOM_STATUS_RUNNING;

                match.currentPlayers = match.waitingPlayers;
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
            const playerIndex = match.currentPlayers.indexOf(player);

            if (playerIndex > -1) {
                match.currentPlayers.splice(playerIndex, 1);
            }

            const waitingPlayerIndex = match.waitingPlayers.indexOf(player);

            if (waitingPlayerIndex > -1) {
                match.waitingPlayers.splice(waitingPlayerIndex, 1);
            }
        }
    });

}

async function startMatch(PubSub, room, match, roundService) {
    console.log('# start match');
    
    match.currentPlayers.forEach(player => {
        const { socket } = player;

        socket.emit('new_match', {
            players: match.currentPlayers.map(player => player.socket.id),
            waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
        });
    });

    while (match.currentRound < match.rounds) {
        match.currentRound += 1
        
        console.log(`# starting round ${match.currentRound}`);

        await roundService.startRound(room, match);

        console.log(`# ending round ${match.currentRound}`);

        match.currentPlayers = room.players;
        match.waitingPlayers = [];
    }

    match.currentPlayers.forEach(player => {
        const { socket } = player;

        socket.emit('match_ended', {
            players: match.currentPlayers.map(player => player.socket.id),
            waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
        });
    });
    
}

