# Mystery [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

Flawless arrays processing.

## Install

`npm i mystery --save`

## Why?

When you use `forEach`, `map`, `filter` you have 2 cons to think about:

- it is not as simple as could be add and remove elements in the middle of array
- you should pass through the array again and again

This is where `mystery` shows it's pros. It processes elements of an array one-by-one.
So you have only one array walk. Similar to the way of [node.js stream works](https://nodejs.org/api/stream.html),
`mystery` is something like `pipe` it joins all `transforms` which are [event emitters](https://nodejs.org/api/events.html) from the inside.

## How to use?

```js
const mystery = require('mystery');
const {map, filter, take, append, insert} = mystery;
const mapper = mystery([
    map((a) => a * a),
    filter((a) => a > 10),
    take(2),
    append(['yes', 'you', 'can'],
    insert(4, 'definitely')
]);

mapper([1, 2, 3, 4, 5], (array) => {
    console.log(array);
    // returns
    [16, 25, 'yes', 'you', 'definitely', 'can']
});

```

## Transforms

You can use any of built-in transforms or write your own.
Consder simple `head` and `tail` transforms which returns first
and rest elements.

This is how `head` transform could look like:

```js
const mystery = require('mystery');

const head = () => {
    return (value, index, emit) => {
        if (!index)
            emit(value)
    }
};

const first = mystery([
    head()
]);

first([1, 2, 3, 4, 5], (array) => {
    console.log(array);
    // result
    [1]
});

```

And here is `tail`:

```js
const mystery = require('mystery');

const tail = () => {
    return (value, index, emit) => {
        if (index)
            emit(value)
    }
};

const rest = mystery([
    tail()
]);

first([1, 2, 3, 4, 5], (array) => {
    console.log(array);
    // returns
    [2, 3, 4, 5]
});

```

You can find more examples at `lib/transforms`.

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/mystery.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-mystery/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/node-mystery.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/mystery "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-mystery  "Build Status"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/node-mystery "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/node-mystery?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/node-mystery/badge.svg?branch=master&service=github

