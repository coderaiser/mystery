'use strict';

module.exports = (fn) => {
    return (value, index, emit) => {
        fn(value);
        emit(value);
    };
};

