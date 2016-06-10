'use strict';

module.exports = () => {
    let array = [];
    
    const merge = (value) => {
        array.push(value);
    };
    
    merge.end = (emit) => {
        emit(array);
    };
    
    return merge;
}

