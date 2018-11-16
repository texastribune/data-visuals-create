'use strict';

if (typeof Promise === 'undefined') {
  window.Promise = require('promise-polyfill').default;
}

// Only polyfill fetch() if we're in a browser
if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}

// Will use the native implementation if it's not bad
Object.assign = require('object-assign');

// Support for...of (a commonly used syntax feature that requires Symbols)
require('core-js/es6/symbol');
// support all of Map()
require('core-js/es6/map');
// support all of Set()
require('core-js/es6/set');
// Support iterable spread (...Set, ...Map)
require('core-js/fn/array/from');

// This is available locally because everyone who made one doesn't understand
// npm, apparently
require('./polyfills/classlist.js');

// We depend on intersection-observer enough that it should just be assumed as necessary
require('intersection-observer');
