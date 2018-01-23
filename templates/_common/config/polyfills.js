if (!window.Promise) window.Promise = require('promise-polyfill');
if (!window.fetch) window.fetch = require('unfetch');

Object.assign = require('object-assign');
require('intersection-observer');
// This is available locally because everyone who made one doesn't understand
// npm, apparently
require('./polyfills/classlist.js');
