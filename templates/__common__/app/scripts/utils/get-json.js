/**
 * A wrapper for the initial response from a fetch call that funnels to
 * res.json().
 *
 * @private
 * @param {Response} res
 * @returns {Promise}
 */
function jsonResponse(res) {
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  return res.json();
}

/**
 * A light wrapper around fetch that assumes you're seeking a JSON response.
 *
 * @param {String|Request} input
 * @param {Object} init
 * @returns {Promise}
 */
export default function getJSON(input, init) {
  return fetch(input, init).then(jsonResponse);
}
