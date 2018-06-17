const constants = require('./constants');
const { choice, delay, removeElementInPlace } = require('../util');

module.exports = service;

function service (PubSub) {
    return {
        async startRound(room, match) {
            return await startRound(PubSub, room, match);
        }
    }
}

async function startRound(PubSub, room, match) {
    const letter = choice(match.availableLetters);
    removeElementInPlace(match.availableLetters, element => element === letter);

    for (let player of match.players) {
        const { socket } = player;

        socket.emit('new_round', {
            letter: letter,
            currentRound: match.currentRound,
        });

        console.log(socket.id);
    }
    
    return await delay(5000);
}


