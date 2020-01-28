'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => 'tape test/**/*.js',
    'watch': () => 'nodemon --watch lib --watch test -d 0.3 --exec',
    'watch:test': () => run('watch', 'npm test'),
    'lint': () => 'putout lib test .madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
};

