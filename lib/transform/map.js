'use strict';

const squad = require('squad');

module.exports = (fn) => {
    return (value, index, emit) => {
        const map = squad(emit, fn);
        
        map(value, index);
    };
};

