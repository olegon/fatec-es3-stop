const messages = require('./messages-definition');

module.exports = service;

const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const TIME_STEP_IN_MS = 1000;

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function service (PubSub) {
    PubSub.subscribe(messages.ROOM_CREATE_MESSAGE, (msg, room) => {
        startNewMatch(PubSub, room);
    });

    return {

    }
}

async function startNewMatch(PubSub, room) {
    console.log('# starting new match');

    const match = {
        currentRound: 0,
        rounds: 5,
        players: [],
        waitingPlayers: []
    };

    PubSub.subscribe(messages.ROOM_PLAYER_JOIN_MESSAGE, (msg, { player, room: destinationRoom }) => {
        if (room == destinationRoom) {
            match.waitingPlayers.push(player);
            
            console.log(match);
        }
    });

    PubSub.subscribe(messages.ROOM_PLAYER_LEFT_MESSAGE, (msg, { player, room: originRoom }) => {
        if (room == originRoom) {
            console.log(match);
        }
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


