'use strict';

function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}

function check() {
  if (process.env.npm_execpath.includes('yarn')) {
    console.log(
      yellow(`
Hey! It looks like you're trying to use \`yarn\` to install your dependencies.
To keep everyone on the same page, the Data Visuals team has moved to exclusively
using \`npm\` to install dependencies. Please use the following instead:

> npm install
    `)
    );

    return 1;
  }

  return 0;
}

process.exit(check());
