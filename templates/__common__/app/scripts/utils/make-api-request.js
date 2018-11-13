import getJSON from './get-json';

/**
 * A helper function for requesting data from the toolkit's API deploy. The
 * helper handles managing the URL building and file extension.
 *
 * @param {string} key The path of the API request
 * @returns {Promise}
 * @example
 * import makeAPIRequest from './utils/api-request';
 *
 * makeAPIRequest('tx-house/138').then(data => data); // the data from the file
 */
export default function makeAPIRequest(key) {
  return getJSON(`${process.env.PUBLIC_PATH}api/${key}.json`);
}
