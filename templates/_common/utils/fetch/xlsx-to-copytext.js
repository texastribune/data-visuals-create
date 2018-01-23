'use strict';

const copytext = require('copytext');

function xlsxToCopyText(xlsx, opts, callback) {
  let parsed, err;

  try {
    parsed = copytext.process(xlsx, opts);
    err = null;
  } catch (e) {
    parsed = null;
    err = e;
  }

  callback(err, parsed);
}

module.exports = xlsxToCopyText;
