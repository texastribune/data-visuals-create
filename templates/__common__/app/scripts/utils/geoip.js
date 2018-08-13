/**
 * Key constant for use with session storage.
 *
 * @private
 * @type {String}
 */
const SESSION_STORAGE_KEY = 'tt-geoip2';

/**
 * URL for GeoIP service.
 *
 * @private
 * @type {String}
 */
const GEOIP_URL = 'https://geoip.texastribune.org';

/**
 * Uses the SESSION_STORAGE_KEY constant to save the provided value to
 * session storage.
 *
 * @private
 * @param {Object} value A JSON object to save to the session storage
 * @returns {void}
 */
function saveJsonToSessionStorage(value) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    /* likely no support for sessionStorage */
  }
}

/**
 * Returns what is provided via the GeoIP service. Uses sessionStorage to
 * help prevent repeat hits to the API endpoint if the user is in the same
 * session.
 *
 * @returns {Promise} The JSON payload returned from the GeoIP service.
 */
export function getGeoIP() {
  try {
    const value = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (value != null) {
      return Promise.resolve(JSON.parse(value));
    }
  } catch (e) {
    /* likely no support for sessionStorage */
  }

  const request = fetch(GEOIP_URL);
  const json = request.then(res => res.json());

  json.then(saveJsonToSessionStorage);
  return json;
}
