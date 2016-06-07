'use strict';

module.exports = (array) => {
    const fn = (value, index, emit) => {
        emit(value);
    };
    
    fn.end = (emit) => {
        array.forEach(emit);
    };
    
    return fn;
};

