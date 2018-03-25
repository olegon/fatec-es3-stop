module.exports = service;

// const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z'];

const TIME_STEP_IN_MS = 1000;

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function service (playerService, wordService) {
    return {
        async startRound (currentPlayers, waitingPlayers, duration) {
            return await startRound(currentPlayers, waitingPlayers, duration, playerService, wordService);
        },
    }
}

function startRound(currentPlayers, waitingPlayers, duration, playerService, wordService) {   
    return new Promise((resolve, reject) => {
        let timeLeft = duration;

        const choosenLetter = choice(AVAILABLE_LETTERS);
        const wordsByPlayer = { };
        
        currentPlayers.forEach(socket => {
            wordsByPlayer[socket.id] = {
                nome: '',
                fruta: '',
                cor: ''  
            };
        });

        const playerConnectedEvent = playerService.onPlayerConnected(socket => {
            socket.emit('current_match', {
                letter: choosenLetter,
                timeLeft: timeLeft
            });
        });
    
        const timerInterval = setInterval(() => {
            timeLeft -= TIME_STEP_IN_MS;
    
            console.log(`# round time left: ${timeLeft}ms`);
    
            if (timeLeft > 0) {
                [...currentPlayers, ...waitingPlayers].forEach(socket => {
                    socket.emit('server_timer', {
                        timeLeft: timeLeft,
                        letter: choosenLetter,
                        currentPlayers: currentPlayers.map(playerSocket => playerSocket.id),
                        waitingPlayers: waitingPlayers.map(playerSocket => playerSocket.id),
                        wordsByUser: wordsByPlayer
                    });
                });
            }
            else {
                encerrarPartida();
            }
        }, TIME_STEP_IN_MS);
    
        function encerrarPartida() {
            console.log(`# closing round with letter ${choosenLetter}`);
    
            console.log('# words: ')
            console.log(JSON.stringify(wordsByPlayer, null, 4));
            
            clearInterval(timerInterval);
            playerConnectedEvent.clear();
    
            currentPlayers.forEach(userSocket => {
                userSocket.removeAllListeners('stop');
                userSocket.removeAllListeners('sending_words');
            });

            const result = {};
            for (let playerId in wordsByPlayer) {
                const words = wordsByPlayer[playerId];
                
                let points = 0;

                if (wordService.isName(words.nome)) {
                    points += 10;
                }

                if (wordService.isFruit(words.fruta)) {
                    points += 10;
                }

                if (wordService.isColor(words.cor)) {
                    points += 10;
                }

                result[playerId] = {
                    points: points
                };
            }
    
            console.log('# round closed');

            resolve(result);
        }
    
        currentPlayers.forEach(playerSocket => {        
            playerSocket.emit('new_match', {
                letter: choosenLetter,
                players: currentPlayers.map(playerSocket => playerSocket.id),
                waitingPLayers: waitingPlayers.map(playerSocket => playerSocket.id),
            });
    
            playerSocket.on('stop', (data) => {
                console.log(`# user ${playerSocket.id} asked for stop.`);
    
                encerrarPartida();
            });
    
            playerSocket.on('sending_words', (words) => {
                const { nome, fruta, cor } = words;
    
                console.log(`# user ${playerSocket.id} is sending words.`);
                
                wordsByPlayer[playerSocket.id] = {
                    nome,
                    fruta,
                    cor
                }
            });
        });
        
        console.log(`# initializing match with letter ${choosenLetter}`);
    });
}


