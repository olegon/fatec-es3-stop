module.exports.delay = delay;
module.exports.choice = choice;
module.exports.removeElementInPlace = removeElementInPlace;
module.exports.internalPlayerRepresentationToSocketRepresentation = internalPlayerRepresentationToSocketRepresentation;

function delay(timeout) {
    return new Promise(res => {
        setTimeout(res, timeout, timeout);
    });
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function removeElementInPlace(array, predicate) {
    let index = -1;

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        
        if (predicate(element)) {
            index = i;
            break;
        }
    }

    if (index > -1) {
        array.splice(index, 1);
    }
}

function internalPlayerRepresentationToSocketRepresentation({ socket, score, mp, frozenInMs }) {
    return {
        playerId: socket.id,
        score,
        mp,
        frozen: frozenInMs > 0,
        canCastFrostPlayer: mp >= 100
    };
}
