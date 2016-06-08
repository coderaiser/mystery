'use strict';

module.exports = (element) => {
    let delta = 0;
    return (value, index, emit) => {
        if ((index + delta) % 2) {
            ++delta;
            emit(element);
        }
        
        emit(value);
    };
};

