// internal
const { logMessage } = require('../utils');

module.exports = async localURL => {
  logMessage(
    'Graphics metadata generation is currently disabled. Puppeteer has been removed pending a permanent solution for Apple News and Newspack graphics plugin.',
    'yellow'
  );

  // Return empty array so parse.js doesn't fail
  return [];
};
