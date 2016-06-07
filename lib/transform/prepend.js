'use strict';

module.exports = (array) => {
    const fn = (value, index, emit) => {
        emit(value);
    };
    
    fn.start = (emit) => {
        array.forEach(emit);
    };
    
    return fn;
};

