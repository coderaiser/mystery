'use strict';

module.exports = (number) => {
    const array = [];
    
    const fn = (value) => {
        array.push(value);
    };
    
    fn.end = (emit) => {
        array
            .slice(array.length - number)
            .forEach(emit);
    };
    
    return fn;
};

