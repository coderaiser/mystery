'use strict';

const Emitter = require('events').EventEmitter;

const isFunction = (fn) => typeof fn === 'function';
const exec = (fn, a, b, c) => isFunction(fn) && fn(a, b, c);

module.exports = (fn) => {
    const emitter = new Emitter();
    
    let index = -1;
    
    const emit = (value) => {
        ++index;
        
        emitter.emit('value', {
            index,
            value,
        });
    };
    
    emitter.on('item', (item) => {
        const {status} = item;
        
        if (!status) {
            exec(fn, item.value, item.index, emit);
        } else {
            exec(fn[status], emit);
            
            emitter.emit('value', {
                status,
            });
        }
    });
    
    return emitter;
};

