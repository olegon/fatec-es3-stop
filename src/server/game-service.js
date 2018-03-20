module.exports = service;

const AVAILABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const TIME_STEP_IN_MS = 1000;

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function service (playerService) {
    let currentMatch = null;
    
    return {
        initMatch (duration = 10000) {
            currentMatch = initMatch(playerService, duration);
        },
    }
}

function initMatch(playerService, duration) {    
    let timeLeft = duration;
    const players = playerService.getPlayers();
    
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

    const timerInterval = setInterval(function () {
        timeLeft -= TIME_STEP_IN_MS;

        console.log(`# Tempo restante da partida ${timeLeft}ms`);

        if (timeLeft <= 0) {
            encerrarPartida();
        }
        else {
            players.forEach(socket => {
                socket.emit('server_timer', {
                    timeLeft: timeLeft
                });
            });
        }
    }, TIME_STEP_IN_MS);

    function encerrarPartida() {
        console.log(`# Encerrando partida ${choosenLetter}`);

        console.log('# Palavras: ')
        console.log(JSON.stringify(wordsByUser, null, 4));
        
        clearInterval(timerInterval);

        players.forEach(userSocket => {
            userSocket.removeAllListeners('stop');
            userSocket.removeAllListeners('sending_words');
        });

        console.log('# Partida encerrada.');

        initMatch(playerService, duration);
    }

    players.forEach(playerSocket => {        
        playerSocket.emit('new_match', {
            letter: choosenLetter,
            players: players.map(playerSocket => playerSocket.id),
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


