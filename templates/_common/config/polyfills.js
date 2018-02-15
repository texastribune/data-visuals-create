if (!window.Promise) window.Promise = require('promise-polyfill');
require('unfetch/polyfill');

Object.assign = require('object-assign');
require('intersection-observer');
// This is available locally because everyone who made one doesn't understand
// npm, apparently
require('./polyfills/classlist.js');
