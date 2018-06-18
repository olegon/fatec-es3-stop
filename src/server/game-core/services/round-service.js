const constants = require('./constants');
const {
    choice,
    delay,
    removeElementInPlace,
    internalPlayerRepresentationToSocketRepresentation
} = require('../util');

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
    let timeLeft = match.roundDuration * 1000;
    let stopRequested = false;
    const letter = choice(match.availableLetters);
    removeElementInPlace(match.availableLetters, element => element === letter);

    const wordsOfRound = {

    };

    for (let player of match.currentPlayers) {
        const { socket } = player;

        socket.emit('new_round', {
            letter: letter,
            currentRound: match.currentRound,
            currentPlayers: match.currentPlayers.map(internalPlayerRepresentationToSocketRepresentation),
            waitingPlayers: match.waitingPlayers.map(player => player.socket.id)
        });

        socket.on('typed_word', (typeWordEvent) => {
            wordsOfRound[socket.id] = wordsOfRound[socket.id] || {};

            wordsOfRound[socket.id][typeWordEvent.category_id] = typeWordEvent.word;

            console.log(wordsOfRound);
        });

        socket.on('stop_request', (data) => {
            wordsOfRound[socket.id] = wordsOfRound[socket.id] || {};
            
            let canStop = true;

            const { dbRoom } = room;

            for (let category of dbRoom.categories) {
                if (wordsOfRound[socket.id] == null || wordsOfRound[socket.id] [category._id] == null) {
                    canStop = false;
                    break;
                }
            }

            console.log(`# is stop request valid ? ${canStop}`);

            stopRequested = stopRequested === false && canStop;
        });
    }


    while (timeLeft > 0 && stopRequested === false) {
        for (let player of [...match.currentPlayers, ...match.waitingPlayers]) {
            const { socket } = player;

            socket.emit('server_timer', {
                timeLeft,
                currentRound: match.currentRound,
                rounds: match.rounds,
                letter,
                currentPlayers: match.currentPlayers.map(internalPlayerRepresentationToSocketRepresentation),
                waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
            });
        }

        timeLeft -= SERVER_TICK_IN_MS;

        await delay(SERVER_TICK_IN_MS);
    }

    await validate(wordService, room, match, letter, wordsOfRound);

    for (let player of match.currentPlayers) {
        const { socket } = player;
        
        socket.emit('round_ended', {
            currentPlayers: match.currentPlayers.map(internalPlayerRepresentationToSocketRepresentation),
            waitingPlayers: match.waitingPlayers.map(player => player.socket.id),
            stopRequested: stopRequested
        });

        socket.removeAllListeners('typed_words');
        socket.removeAllListeners('stop_request');
    }
}

async function validate(wordService, room, match, letter, socketIdToWords) {
    for (let socketId in socketIdToWords) {
        const categoryToWord = socketIdToWords[socketId];

        const currentPlayer = match.currentPlayers.find(player => player.socket.id == socketId);

        if (currentPlayer == null) continue;

        for (let category in categoryToWord) {
            const word = categoryToWord[category];
            
            console.log(`${socketId} sent word ${word} of category ${category}`);

            if (await wordService.isValid(word, category, letter)) {
                currentPlayer.score += 50;
            }
        }
    }
}

