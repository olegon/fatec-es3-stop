const constants = require('./constants');
const { choice, delay, removeElementInPlace } = require('../util');

const SERVER_TICK_IN_MS = 1000;

module.exports = service;

function service(PubSub, wordService) {
    return {
        async startRound(room, match) {
            return await startRound(PubSub, wordService, room, match);
        }
    }
}

async function startRound(PubSub, wordService, room, match) {
    const letter = choice(match.availableLetters);
    removeElementInPlace(match.availableLetters, element => element === letter);

    const wordsOfRound = {

    };

    for (let player of match.currentPlayers) {
        const { socket } = player;

        socket.emit('new_round', {
            letter: letter,
            currentRound: match.currentRound,
        });

        socket.on('typed_word', (typeWordEvent) => {
            wordsOfRound[socket.id] = wordsOfRound[socket.id] || {};

            wordsOfRound[socket.id][typeWordEvent.category_id] = typeWordEvent.word;

            console.log(wordsOfRound);
        });
    }

    let timeLeft = match.roundDuration / 10 * 1000;

    while (timeLeft > 0) {
        for (let player of [...match.currentPlayers, ...match.waitingPlayers]) {
            const { socket } = player;

            socket.emit('server_timer', {
                timeLeft,
                currentPlayers: match.currentPlayers.map(player => ({
                    playerId: player.socket.id,
                    score: player.score
                })),
                waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
            });
        }

        timeLeft -= SERVER_TICK_IN_MS;

        await delay(SERVER_TICK_IN_MS);
    }

    await validate(wordService, room, match, wordsOfRound);

    for (let player of match.currentPlayers) {
        const { socket } = player;

        socket.emit('round_ended', {});
        socket.removeAllListeners('typed_words');
    }
}

async function validate(wordService, room, match, socketIdToWords) {

    for (let socketId in socketIdToWords) {
        const categoryToWord = socketIdToWords[socketId];

        const currentPlayer = match.currentPlayers.find(player => player.socket.id == socketId);

        if (currentPlayer == null) continue;

        for (let category in categoryToWord) {
            const word = categoryToWord[category];
            
            if (await wordService.isValid(word, category)) {
                console.log('valid');
                currentPlayer.score += 50;
            }
            else {
                console.log('invalid');
            }

            console.log(`${socketId} sent word ${word} of category ${category}`);
        }
    }
}

