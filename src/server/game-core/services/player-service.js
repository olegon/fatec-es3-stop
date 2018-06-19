const constants = require('./constants');

module.exports = service;

function service(PubSub) {
    const players = [];
    
    return {
        connect (socket, userName) {
            const newPlayer = {
                socket,
                score: 0,
                mp: 0,
                frozenInMs: 0,
                confusionInMs: 0,
                userName
            };

            players.push(newPlayer);

            PubSub.publish(constants.PLAYER_CONNECTED_MESSAGE, newPlayer);
        },

        getPlayerBySocket(socket) {
            const playerIndex = players.findIndex(player => player.socket === socket);

            if (playerIndex > -1) {
                return  players[playerIndex];
            }
            else {
                return null;
            }
        },
        
        disconnect (socket) {
            const playerIndex = players.findIndex(player => player.socket === socket);
            
            if (playerIndex > -1) {
                const player = players[playerIndex];

                players.splice(playerIndex, 1);

                PubSub.publish(constants.PLAYER_DISCONNECTED_MESSAGE, player);
            }
        },
    }
}


