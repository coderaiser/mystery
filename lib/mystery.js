'use strict';

const Emitter = require('events').EventEmitter;
const currify = require('currify');
const squad = require('squad');

const chain = require('./chain');
const join = require('./join');
const decouple = require('./transform/decouple');
const pass = require('./transform/pass');
const merge = require('./transform/merge');

const pipe = currify((emitters, array, fn) => {
    const remover = remove(emitters);
    const decoupler = chain(decouple());
    const passer = chain(pass(fn));
    const merger = chain(merge());
    const first = decoupler;
    const concat = (array) => [].concat.apply([], array);
    
    join(concat([
        decoupler,
        emitters,
        merger,
        passer,
        remover
    ]));
    
    first.emit('item', {
        status: 'start'
    });
    
    first.emit('item', {
        value: array,
        index: 0
    });
    
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
module.exports.intersperse = require('./transform/intersperse');
module.exports.mapsome = require('./transform/mapsome');
module.exports.decouple = decouple;
module.exports.pass = pass;
module.exports.join = join;

function mapChain(funcs) {
    return funcs.map((fn) => chain(fn));
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

