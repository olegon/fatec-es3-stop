module.exports = service;

function service() {
    const players = [];
    
    return {
        connect (player) {
            players.push(player);
        },
        
        getPlayers () {
            return [...players]
        },
        
        disconnect (player) {
            const index = players.indexOf(player);

            if (index > -1) {
                players.splice(index, 1);
            }
        },
    }
}