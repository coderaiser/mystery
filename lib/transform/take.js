'use strict';

const filter = require('./filter');

module.exports = (number) => {
    return filter((value, index) => {
        return index < number;
    });
};

