module.exports = service;

const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const TIME_STEP_IN_MS = 1000;

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function service (playerService, wordService) {
    let currentMatch = null;
    
    return {
        initMatch (duration = 15000) {
            currentMatch = initMatch(playerService, wordService, duration);
        },
    }
}

function initMatch(playerService, wordService, duration) {    
    let timeLeft = duration;
    const players = playerService.getPlayers();
    const playersWaiting = [];
    
    const wordsByUser = {
        
    };

    players.forEach(playerSocket => {
        wordsByUser[playerSocket.id] = {
          nome: '',
          fruta: '',
          cor: ''  
        };
    });
    
    const choosenLetter = choice(AVAILABLE_LETTERS);

    const playerConnectedEvent = playerService.onPlayerConnected(function (player) {
        player.emit('current_match', {
            letter: choosenLetter,
            timeLeft: timeLeft
        });

        playersWaiting.push(player);
    });

    const playerDisconnectedEvent = playerService.onPlayerDisconnected(function (player) {
        const playerIndex = players.indexOf(player);
        if (playerIndex > -1) {
            players.splice(playerIndex, 1);
            return;
        }
    
        const playerWaitingIndex = playersWaiting.indexOf(player);
        if (playerWaitingIndex > -1) {
            playersWaiting.splice(playerWaitingIndex, 1);
            return;
        }
    });

    const timerInterval = setInterval(function () {
        timeLeft -= TIME_STEP_IN_MS;

        console.log(`# Tempo restante da partida ${timeLeft}ms`);

        if (timeLeft <= 0) {
            encerrarPartida();
        }
        else {
            [...players, ...playersWaiting].forEach(socket => {
                socket.emit('server_timer', {
                    timeLeft: timeLeft,
                    letter: choosenLetter,
                    players: players.map(playerSocket => playerSocket.id),
                    playersWaiting: playersWaiting.map(playerSocket => playerSocket.id),
                });
            });
        }
    }, TIME_STEP_IN_MS);

    function encerrarPartida() {
        console.log(`# Encerrando partida ${choosenLetter}`);

        console.log('# Palavras: ')
        console.log(JSON.stringify(wordsByUser, null, 4));
        
        clearInterval(timerInterval);
        playerConnectedEvent.clear();
        playerDisconnectedEvent.clear();

        players.forEach(userSocket => {
            userSocket.removeAllListeners('stop');
            userSocket.removeAllListeners('sending_words');
        });

        console.log('# Partida encerrada.');

        initMatch(playerService, wordService, duration);
    }

    players.forEach(playerSocket => {        
        playerSocket.emit('new_match', {
            letter: choosenLetter,
            players: players.map(playerSocket => playerSocket.id),
            playersWaiting: playersWaiting.map(playerSocket => playerSocket.id),
        })

        playerSocket.on('stop', (data) => {
            console.log(`# User ${playerSocket.id} asked for stop.`);

            encerrarPartida();
        });

        playerSocket.on('sending_words', (words) => {
            const { nome, fruta, cor } = words;

            console.log(`# User ${playerSocket.id} is sending words.`);
            
            wordsByUser[playerSocket.id] = {
                nome,
                fruta,
                cor
            }
        });
    });
    
    console.log(`# Iniciando partida ${choosenLetter}`);
}


