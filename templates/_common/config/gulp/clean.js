'use strict';

const del = require('del');

module.exports = done => {
  return del(['./dist', './.tmp'], { dot: true }, done);
};
