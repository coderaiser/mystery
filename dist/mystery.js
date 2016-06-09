(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mystery = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"events":12}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function (condition) {
    return function (value, index, emit) {
        condition(value, index) && emit(value);
    };
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function (number, element) {
    return function (value, index, emit) {
        if (index === number) emit(element);

        emit(value);
    };
};
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    return function (value, index, emit) {
        emit(fn(value, index));
    };
};
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
'use strict';

var filter = require('./filter');

module.exports = function (number) {
    return filter(function (value, index) {
        return index < number;
    });
};
},{"./filter":3}],11:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

module.exports = currify;

var tail = function tail(list) {
    return [].slice.call(list, 1);
};

function currify(fn) {
    check(fn);

    var args = tail(arguments);

    if (args.length >= fn.length) return fn.apply(undefined, _toConsumableArray(args));else return function () {
        return currify.apply(undefined, [fn].concat(_toConsumableArray(args), Array.prototype.slice.call(arguments)));
    };
}

function check(fn) {
    if (typeof fn !== 'function') throw Error('fn should be function!');
}
},{}],12:[function(require,module,exports){
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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],13:[function(require,module,exports){
(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports  = mapa;
    else
        global.mapa     = mapa;
    
    function mapa(fn, list) {
        check(fn, list);
        
        var i       = 0,
            n       = list.length,
            result  = Array(n);
          
        for (i = 0; i < n; i++)
            result[i] = fn(list[i], i, n, list);
          
        return result;
    }
    
    function check(fn, array) {
        if (typeof fn !== 'function')
            throw Error('fn should be function!');
        
        if (!Array.isArray(array))
            throw Error('list should be an array!');
    }
})(this);

},{}],14:[function(require,module,exports){
(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports  = squad;
    else
        global.squad    = squad;
    
    function squad() {
        var funcs = [].slice.call(arguments);
                
        check('function', funcs);
        
        return function() {
            return funcs
                .reduceRight(apply, arguments)
                .pop();
        };
    }
    
    function apply(value, fn) {
        return [fn.apply(null, value)];
    }
    
    function check(type, array) {
        var wrongType   = partial(wrong, type),
            notType     = partial(notEqual, type);
        
        if (!array.length)
            wrongType(type);
        else
            array
                .map(getType)
                .filter(notType)
                .forEach(wrongType);
    }
    
    function partial(fn, value) {
        return fn.bind(null, value);
    }
    
    function getType(item) {
        return typeof item;
    }
    
    function notEqual(a, b) {
        return a !== b;
    }
    
    function wrong(type) {
        throw Error('fn should be ' + type + '!');
    }
    
})(this);

},{}],"mystery":[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Emitter = require('events').EventEmitter;
var currify = require('currify');
var mapa = require('mapa');
var squad = require('squad');

var chain = require('./chain');

var pipe = currify(function (emitters, array, fn) {
    var first = emitters[0];
    var collector = collect(fn);
    var remover = remove(emitters);

    join(emitters.concat(collector, remover));

    first.emit('item', {
        status: 'start'
    });

    mapa(function (value, index) {
        first.emit('item', {
            value: value,
            index: index
        });
    }, array);

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

function mapChain(funcs) {
    return funcs.map(function (fn) {
        return chain(fn);
    });
}

function join(emitters) {
    emitters.reduce(function (current, next) {
        current.on('value', function (value) {
            next.emit('item', value);
        });

        return next;
    });

    return emitters;
}

function remove(emitters) {
    return new Emitter().on('item', function (item) {
        if (item.status !== 'end') return;

        emitters.forEach(function (emitter) {
            return emitter.removeAllListeners('value');
        });
    });
}

function collect(fn) {
    var emitter = new Emitter();
    var array = [];

    emitter.on('item', function (item) {
        if (item.status === 'end') fn(array);else if (!item.status) array.push(item.value);

        emitter.emit('value', item);
    });

    return emitter;
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
},{"./chain":1,"./transform/append":2,"./transform/filter":3,"./transform/insert":4,"./transform/intersperse":5,"./transform/map":6,"./transform/prepend":7,"./transform/sort":8,"./transform/take":10,"./transform/take-last":9,"currify":11,"events":12,"mapa":13,"squad":14}]},{},["mystery"])("mystery")
});