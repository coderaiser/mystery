'use strict';

const id = (a) => a;

module.exports = (map, condition) => {
    condition = condition || id;
    let done;
    let result;
    
    const mapsome = (value) => {
        if (done)
            return;
        
        result = map(value);
        done = condition(result);
    };
    
    mapsome.end = (emit) => {
        emit(result);
    };
    
    return mapsome;
};

