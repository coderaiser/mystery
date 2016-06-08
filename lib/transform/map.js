'use strict';

module.exports = (fn) => {
    return (value, index, emit) => {
        emit(fn(value, index));
    };
};

