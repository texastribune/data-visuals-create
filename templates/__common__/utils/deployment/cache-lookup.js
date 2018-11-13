'use strict';

const lookup = [
  {
    control: 'max-age=60', // 1 minute
    types: ['text/html'],
  },
  {
    control: 'max-age=31536000', // 1 year
    types: ['text/css', 'application/javascript'],
  },
  {
    control: 'max-age=604800', // 1 week
    types: [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ],
  },
  {
    control: 'max-age=300', // 5 minutes
    types: ['application/json'],
  },
];

module.exports = type => {
  return lookup.find(pair => {
    return pair.types.some(s => s === type);
  });
};
