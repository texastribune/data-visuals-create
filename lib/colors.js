// packages
const c = require('ansi-colors');

const bold = c.bold;
const highlight = c.blue;
const warn = c.yellow;
const alert = c.bold.black.bgMagenta;

module.exports = { alert, bold, highlight, warn };
