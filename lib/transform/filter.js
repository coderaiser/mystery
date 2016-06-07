'use strict';

module.exports = (condition) => {
    return (value, index, emit) => {
        condition(value, index) && emit(value);
    };
};

