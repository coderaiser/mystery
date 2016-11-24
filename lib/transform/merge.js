'use strict';

module.exports = () => {
    const array = [];
    
    const merge = (value) => {
        array.push(value);
    };
    
    merge.end = (emit) => {
        emit(array);
    };
    
    return merge;
};

