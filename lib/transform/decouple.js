'use strict';

const mapa = require('mapa');

module.exports = () => {
    return (value, index, emit) => {
        if (!Array.isArray(value))
            emit(value);
        else
            mapa(emit, value);
    };
};

