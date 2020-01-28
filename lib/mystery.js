'use strict';

const {EventEmitter} = require('events');
const currify = require('currify');
const squad = require('squad');

const chain = require('./chain');
const join = require('./join');
const decouple = require('./transform/decouple');
const pass = require('./transform/pass');
const merge = require('./transform/merge');

const flatten = (array) => [].concat(...array);

const pipe = currify((emitters, value, fn) => {
    const remover = remove(emitters);
    const decoupler = chain(decouple());
    const passer = chain(pass(fn));
    const merger = chain(merge());
    const first = decoupler;
    
    join(flatten([
        decoupler,
        emitters,
        merger,
        passer,
        remover,
    ]));
    
    first.emit('item', {
        status: 'start',
    });
    
    first.emit('item', {
        value,
        index: 0,
    });
    
    first.emit('item', {
        status: 'end',
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
    return new EventEmitter()
        .on('item', (item) => {
            if (item.status !== 'end')
                return;
            
            for (const emitter of emitters)
                emitter.removeAllListeners('value');
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

