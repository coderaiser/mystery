'use strict';

const {
    run,
    series,
    parallel,
} = require('madrun');

module.exports = {
    "test": () => 'tape \'test/**/*.js\'',
    "watch": () => 'nodemon --watch lib --watch test -d 0.3 --exec',
    "watch:test": () => run(['watch'], 'npm test'),
    "eslint": () => 'eslint lib test',
    "putout": () => 'putout lib test',
    "fix:lint": () => run(['putout', 'eslint'], '--fix'),
    "lint": () => run(['putout', 'eslint']),
    "jscs-fix": () => run(['jscs', '--fix']),
    "coverage": () => 'nyc npm test',
    "report": () => 'nyc report --reporter=text-lcov | coveralls',
    "6to5": () => 'babel lib -d legacy',
    "wisdom": () => run(['build']),
    "minify": () => 'minify dist/mystery.js > dist/mystery.min.js',
    "mkdir": () => 'mkdirp dist legacy',
    "build": () => run(['mkdir', '6to5', 'legacy:index', 'bundle:legacy', 'minify']),
    "bundle:base": () => 'browserify -s mystery --ng false',
    "legacy:index": () => 'echo "module.exports = require(\'./mystery\');" > legacy/index.js',
    "bundle:legacy:base": () => run(['bundle:base'], '-r ./legacy/mystery.js:mystery ./legacy/mystery.js'),
    "bundle:legacy": () => run(['bundle:legacy:base'], '-o dist/mystery.js')
};

