'use strict';

module.exports = (fn) => {
    const array = [];
    const sort = (value) => {
        return array.push(value);
    };
    
    sort.end = (emit) => {
        array
            .sort(fn)
            .forEach(emit);
    };
    
    return sort;
};

