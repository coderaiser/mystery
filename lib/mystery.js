'use strict';

const Emitter = require('events').EventEmitter;
const currify = require('currify');
const mapa = require('mapa');
const squad = require('squad');

const chain = require('./chain');

const pipe = currify((emitters, array, fn) => {
    const first = emitters[0];
    const collector = collect(fn);
    const remover = remove(emitters);
    
    join(emitters.concat(collector, remover));
    
    first.emit('item', {
        status: 'start'
    });
    
    mapa((value, index) => {
        first.emit('item', {
            value,
            index
        });
    }, array);
    
    first.emit('item', {
        status: 'end'
    });
});

module.exports = squad(pipe, mapChain, check);

module.exports.map = require('./transform/map');
module.exports.filter = require('./transform/filter');
module.exports.append = require('./transform/append');
module.exports.prepend = require('./transform/prepend');
module.exports.sort = require('./transform/sort');
module.exports.take = require('./transform/take');
module.exports.takeLast = require('./transform/take-last');
module.exports.insert = require('./transform/insert');

function mapChain(funcs) {
    return funcs.map((fn) => chain(fn));
}

function join(emitters) {
    emitters.reduce((current, next) => {
        current.on('value', (value) => {
            next.emit('item', value);
        });
        
        return next;
    });
    
    return emitters;
}

function remove(emitters) {
    return new Emitter()
        .on('item', (item) => {
            if (item.status !== 'end')
                return;
            
            emitters.forEach((emitter) =>
                emitter.removeAllListeners('value'));
        });
}

function collect(fn) {
    const emitter = new Emitter();
    let array = [];
    
    emitter.on('item', (item) => {
        if (item.status === 'end')
            fn(array);
        else if (!item.status)
            array.push(item.value);
        
        emitter.emit('value', item);
    });
    
    return emitter;
}

function check(funcs) {
    if (!Array.isArray(funcs))
        throw Error('funcs should be an array!');
    
    funcs.map((fn) => typeof fn)
        .filter((type) => type !== 'function')
        .forEach(() => {
            throw Error('funcs should contain functions only!');
        });
        
    return funcs;
}

