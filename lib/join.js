'use strict';

module.exports = (emitters) => {
    emitters.reduce((current, next) => {
        current.on('value', (value) => {
            next.emit('item', value);
        });
        
        return next;
    });
    
    return emitters;
};
