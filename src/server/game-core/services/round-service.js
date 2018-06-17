const constants = require('./constants');
const { choice, delay, removeElementInPlace } = require('../util');

const SERVER_TICK_IN_MS = 1000;

module.exports = service;

function service(PubSub) {
    return {
        async startRound(room, match) {
            return await startRound(PubSub, room, match);
        }
    }
}

async function startRound(PubSub, room, match) {
    const letter = choice(match.availableLetters);
    removeElementInPlace(match.availableLetters, element => element === letter);

    const wordsOfRound = {};

    for (let player of match.currentPlayers) {
        const { socket } = player;

        socket.emit('new_round', {
            letter: letter,
            currentRound: match.currentRound,
        });

        socket.on('typed_words', (data) => {
            wordsOfRound[socket.id] = data;

            console.log(wordsOfRound);
        });
    }

    let timeLeft = match.roundDuration * 1000;

    while (timeLeft > 0) {
        for (let player of [...match.currentPlayers, ...match.waitingPlayers]) {
            const { socket } = player;

            socket.emit('server_timer', {
                timeLeft,
                currentPlayers: match.currentPlayers.map(player => player.socket.id),
                waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
            });
        }

        timeLeft -= SERVER_TICK_IN_MS;

        await delay(SERVER_TICK_IN_MS);
    }

    for (let player of match.currentPlayers) {
        const { socket } = player;

        socket.removeAllListeners('typed_words');
    }
}


