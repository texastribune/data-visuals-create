'use strict';

function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}

function check() {
  if (process.env.npm_execpath.includes('yarn')) {
    console.log(
      yellow(`
Hey! It looks like you're using yarn to install your dependencies. As of
January 2018 we've moved back to using npm to install packages. Nothing is gonna
prevent you from doing this (yet), but please use \`npm install\` in the future.

If you'd like to do this now, \`rm -r node_modules\` and run \`npm install\`
instead to ensure you're getting all the benefits of using npm. Thank you!
    `)
    );
  }

  return 0;
}

process.exit(check());
