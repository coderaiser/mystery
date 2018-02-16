(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mystery = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var Emitter = require('events').EventEmitter;

var isFunction = function isFunction(fn) {
    return typeof fn === 'function';
};
var exec = function exec(fn, a, b, c) {
    return isFunction(fn) && fn(a, b, c);
};

module.exports = function (fn) {
    var emitter = new Emitter();

    var index = -1;

    var emit = function emit(value) {
        ++index;

        emitter.emit('value', {
            index: index,
            value: value
        });
    };

    emitter.on('item', function (item) {
        var status = item.status;

        if (!status) {
            exec(fn, item.value, item.index, emit);
        } else {
            exec(fn[status], emit);

            emitter.emit('value', {
                status: status
            });
        }
    });

    return emitter;
};
},{"events":18}],2:[function(require,module,exports){
'use strict';

module.exports = function (emitters) {
    emitters.reduce(function (current, next) {
        current.on('value', function (value) {
            next.emit('item', value);
        });

        return next;
    });

    return emitters;
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function (array) {
    var fn = function fn(value, index, emit) {
        emit(value);
    };

    fn.end = function (emit) {
        array.forEach(emit);
    };

    return fn;
};
},{}],4:[function(require,module,exports){
'use strict';

var mapa = require('mapa');

module.exports = function () {
    return function (value, index, emit) {
        if (!Array.isArray(value)) emit(value);else mapa(emit, value);
    };
};
},{"mapa":19}],5:[function(require,module,exports){
'use strict';

module.exports = function (condition) {
    return function (value, index, emit) {
        condition(value, index) && emit(value);
    };
};
},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (number, element) {
    return function (value, index, emit) {
        if (index === number) emit(element);

        emit(value);
    };
};
},{}],7:[function(require,module,exports){
'use strict';

module.exports = function (element) {
    var delta = 0;
    return function (value, index, emit) {
        if ((index + delta) % 2) {
            ++delta;
            emit(element);
        }

        emit(value);
    };
};
},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    return function (value, index, emit) {
        emit(fn(value, index));
    };
};
},{}],9:[function(require,module,exports){
'use strict';

var id = function id(a) {
    return a;
};

module.exports = function (map, condition) {
    condition = condition || id;
    var done = void 0;
    var result = void 0;

    var mapsome = function mapsome(value) {
        if (done) return;

        result = map(value);
        done = condition(result);
    };

    mapsome.end = function (emit) {
        emit(result);
    };

    return mapsome;
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function () {
    var array = [];

    var merge = function merge(value) {
        array.push(value);
    };

    merge.end = function (emit) {
        emit(array);
    };

    return merge;
};
},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    return function (value, index, emit) {
        fn(value);
        emit(value);
    };
};
},{}],12:[function(require,module,exports){
'use strict';

module.exports = function (array) {
    var fn = function fn(value, index, emit) {
        emit(value);
    };

    fn.start = function (emit) {
        array.forEach(emit);
    };

    return fn;
};
},{}],13:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    var array = [];
    var sort = function sort(value) {
        return array.push(value);
    };

    sort.end = function (emit) {
        array.sort(fn).forEach(emit);
    };

    return sort;
};
},{}],14:[function(require,module,exports){
'use strict';

module.exports = function (number) {
    var array = [];

    var fn = function fn(value) {
        array.push(value);
    };

    fn.end = function (emit) {
        array.slice(array.length - number).forEach(emit);
    };

    return fn;
};
},{}],15:[function(require,module,exports){
'use strict';

var filter = require('./filter');

module.exports = function (number) {
    return filter(function (value, index) {
        return index < number;
    });
};
},{"./filter":5}],16:[function(require,module,exports){
module.exports = require('./lib/currify');

},{"./lib/currify":17}],17:[function(require,module,exports){
'use strict';

var f = function f(fn) {
    return [
    /*eslint no-unused-vars: 0*/
    function (a) {
        return fn.apply(undefined, arguments);
    }, function (a, b) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c, d) {
        return fn.apply(undefined, arguments);
    }, function (a, b, c, d, e) {
        return fn.apply(undefined, arguments);
    }];
};

module.exports = function currify(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    check(fn);

    if (args.length >= fn.length) return fn.apply(undefined, args);

    var again = function again() {
        return currify.apply(undefined, [fn].concat(args, Array.prototype.slice.call(arguments)));
    };

    var count = fn.length - args.length - 1;
    var func = f(again)[count];

    return func || again;
};

function check(fn) {
    if (typeof fn !== 'function') throw Error('fn should be function!');
}
},{}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],19:[function(require,module,exports){
(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports  = mapa;
    else
        global.mapa     = mapa;
    
    function mapa(fn, list) {
        check(fn, list);
        
        var n       = list.length,
            j       = 0,
            i       = n + 1,
            result  = Array(n);
        
        while(--i) {
            j = n - i;
            result[j] = fn(list[j], j, list);
        }
          
        return result;
    }
    
    function check(fn, array) {
        if (typeof fn !== 'function')
            throw Error('fn should be function!');
        
        if (!Array.isArray(array))
            throw Error('list should be an array!');
    }
})(this);

},{}],20:[function(require,module,exports){
module.exports = require('./squad');

},{"./squad":21}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = function () {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }

    check('function', funcs);

    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return funcs.reduceRight(apply, args).pop();
    };
};

function apply(value, fn) {
    return [fn.apply(undefined, _toConsumableArray(value))];
}

function check(type, array) {
    var wrongType = partial(wrong, type);
    var notType = partial(notEqual, type);

    if (!array.length) return wrongType(type);

    array.map(getType).filter(notType).forEach(wrongType);
}

function partial(fn, value) {
    return fn.bind(null, value);
}

function getType(item) {
    return typeof item === 'undefined' ? 'undefined' : _typeof(item);
}

function notEqual(a, b) {
    return a !== b;
}

function wrong(type) {
    throw Error('fn should be ' + type + '!');
}
},{}],"mystery":[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Emitter = require('events').EventEmitter;
var currify = require('currify/legacy');
var squad = require('squad/legacy');

var chain = require('./chain');
var join = require('./join');
var decouple = require('./transform/decouple');
var pass = require('./transform/pass');
var merge = require('./transform/merge');

var flatten = function flatten(array) {
    return [].concat.apply([], array);
};

var pipe = currify(function (emitters, array, fn) {
    var remover = remove(emitters);
    var decoupler = chain(decouple());
    var passer = chain(pass(fn));
    var merger = chain(merge());
    var first = decoupler;

    join(flatten([decoupler, emitters, merger, passer, remover]));

    first.emit('item', {
        status: 'start'
    });

    first.emit('item', {
        value: array,
        index: 0
    });

    first.emit('item', {
        status: 'end'
    });
});

module.exports = squad(pipe, mapChain, check);

module.exports.map = require('./transform/map');
module.exports.filter = require('./transform/filter');
module.exports.append = require('./transform/append');
module.exports.prepend = require('./transform/prepend');
module.exports.sort = require('./transform/sort');
module.exports.take = require('./transform/take');
module.exports.takeLast = require('./transform/take-last');
module.exports.insert = require('./transform/insert');
module.exports.intersperse = require('./transform/intersperse');
module.exports.mapsome = require('./transform/mapsome');
module.exports.decouple = decouple;
module.exports.pass = pass;
module.exports.join = join;

function mapChain(funcs) {
    return funcs.map(function (fn) {
        return chain(fn);
    });
}

function remove(emitters) {
    return new Emitter().on('item', function (item) {
        if (item.status !== 'end') return;

        emitters.forEach(function (emitter) {
            return emitter.removeAllListeners('value');
        });
    });
}

function check(funcs) {
    if (!Array.isArray(funcs)) throw Error('funcs should be an array!');

    funcs.map(function (fn) {
        return typeof fn === 'undefined' ? 'undefined' : _typeof(fn);
    }).filter(function (type) {
        return type !== 'function';
    }).forEach(function () {
        throw Error('funcs should contain functions only!');
    });

    return funcs;
}
},{"./chain":1,"./join":2,"./transform/append":3,"./transform/decouple":4,"./transform/filter":5,"./transform/insert":6,"./transform/intersperse":7,"./transform/map":8,"./transform/mapsome":9,"./transform/merge":10,"./transform/pass":11,"./transform/prepend":12,"./transform/sort":13,"./transform/take":15,"./transform/take-last":14,"currify/legacy":16,"events":18,"squad/legacy":20}]},{},["mystery"])("mystery")
});