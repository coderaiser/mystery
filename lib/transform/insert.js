'use strict';

module.exports = (number, element) => {
    return (value, index, emit) => {
        if (index === number)
            emit(element);
        
        emit(value);
    };
};

