module.exports = service;

const roundServiceConstrutor = require('./round-service');

function service (playerService, wordService) {
    const roundService = roundServiceConstrutor(playerService, wordService);
    
    return {
        async startMatches(count) {
            return await startMatches(playerService, roundService, count);
        }
    };
}

async function startMatches(playerService, roundService, rounds) {
    let currentPlayers = playerService.getPlayers();
    let waitingPlayers = [];

    const onPlayerConnectedEvent = playerService.onPlayerConnected(socket => {
        console.log(`# adding player ${socket.id} to waiting players`);
        waitingPlayers.push(socket);
    });
    
    const onPlayerDisconnectedEvent = playerService.onPlayerDisconnected(socket => {
        const playerIndex = currentPlayers.indexOf(socket);
        if (playerIndex > -1) {
            console.log(`# removing player ${socket.id} from current players`);
            currentPlayers.splice(playerIndex, 1);
            return;
        }
    
        const playerWaitingIndex = waitingPlayers.indexOf(socket);
        if (playerWaitingIndex > -1) {
            console.log(`# removing player ${socket.id} from waiting players`);
            waitingPlayers.splice(playerWaitingIndex, 1);
            return;
        }
    });

    console.log(`# starting new match`);

    for (let i = 0; i < rounds; i++) {
        console.log(`# starting round ${i + 1}`);
        
        currentPlayers = [...currentPlayers, ...waitingPlayers];
        waitingPlayers = [];
        
        const result = await roundService.startRound(currentPlayers, waitingPlayers, 15000);
        
        console.log(result);
    }

    console.log(`# ending match`);

    onPlayerConnectedEvent.clear();
    onPlayerDisconnectedEvent.clear();
}

function startRound(players) {
    return new Promise((res, rej) => {
        setTimeout(res, 5000, { result: null });
    });
}