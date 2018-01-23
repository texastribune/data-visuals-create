'use strict';

/**
 * Where custom filters for Nunjucks should be added. Each key should be the
 * name of the filter, and each value should be a function it will call.
 *
 * (journalize comes built in and does not need to be added manually.)
 *
 * Example:
 * module.exports = {
 *   square: (val) => val * val;
 * };
 *
 * Then in your templates:
 * {{ num|square }}
 *
 */
module.exports = {};
