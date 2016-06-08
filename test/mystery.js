'use strict';

const test = require('tape');
const mystery = require('..');

const map = mystery.map;
const filter = mystery.filter;
const append = mystery.append;
const prepend = mystery.prepend;
const sort = mystery.sort;
const insert = mystery.insert;

test('use a few filters', (t) => {
    const fn = mystery([
        filter(a => a > 1),
        map(a => ++a)
    ]);
    
    fn([1, 2, 3, 4], (array) => {
        t.deepEqual(array, [3, 4, 5], 'should result be filtered');
        t.end();
    });
});

test('reuse mystery mapper', (t) => {
    const fn = mystery([
        filter(a => a > 1),
        map(a => ++a)
    ]);
    
    fn([1, 2, 3, 4], (array) => {
        t.deepEqual(array, [3, 4, 5], 'should result be filtered');
    });
    
    fn([2, 3, 4, 5], (array) => {
        t.deepEqual(array, [3, 4, 5, 6], 'should result be filtered');
        t.end();
    });
});

test('append', (t) => {
    const fn = mystery([
        append([9, 8, 7, 6])
    ]);
    
    fn([1, 2, 3], (array) => {
        t.deepEqual(array, [1, 2, 3, 9, 8, 7, 6], 'should result be appended');
        t.end();
    });
});

test('prepend', (t) => {
    const fn = mystery([
        prepend([10])
    ]);
    
    fn([1, 2, 3], (array) => {
        t.deepEqual(array, [10, 1, 2, 3], 'should result be prepended');
        t.end();
    });
});

test('filter + map + append', (t) => {
    const fn = mystery([
        filter((a) => a > 1),
        map((a) => a * a),
        append([3, 1, 3, 3])
    ]);
    
    fn([1, 2, 3], (array) => {
        t.deepEqual(array, [4, 9, 3, 1, 3, 3], 'should result be processed');
        t.end();
    });
});

test('take', (t) => {
    const take = mystery.take;
    
    const fn = mystery([
        take(2)
    ]);
    
    fn([1, 2, 3], (array) => {
        t.deepEqual(array, [1, 2], 'should result be processed');
        t.end();
    });
});

test('takeLast', (t) => {
    const takeLast = mystery.takeLast;
    
    const fn = mystery([
        takeLast(2)
    ]);
    
    fn([1, 2, 3, 4, 5], (array) => {
        t.deepEqual(array, [4, 5], 'should result be processed');
        t.end();
    });
});

test('sort', (t) => {
    const fn = mystery([
        sort((a, b) => a - b)
    ]);
    
    fn([3, 20, 1, 5], (array) => {
        t.deepEqual(array, [1, 3, 5, 20], 'should result be processed');
        t.end();
    });
});

test('insert', (t) => {
    const fn = mystery([
        insert(2, 'hello')
    ]);
    
    fn([3, 20, 1], (array) => {
        t.deepEqual(array, [3, 20, 'hello', 1], 'should result be processed');
        t.end();
    });
});

test('arguments: no', (t) => {
    t.throws(mystery, /funcs should be an array!/, 'should throw when no arguments');
    t.end();
});

test('arguments: not function', (t) => {
    const fn = () => {
       mystery([
           'hello'
       ]);
    };
    t.throws(fn, /funcs should contain functions only!/, 'should throw when arguments no function');
    t.end();
});

