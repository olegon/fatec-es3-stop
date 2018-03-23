const events = require('events');

module.exports.bindEvent = bindEvent;

function bindEvent(eventEmitter, eventName, listener) {
    eventEmitter.on(eventName, listener);
    
    return {
        clear() {
            eventEmitter.removeListener(eventName, listener);
        }
    };
}