/**
 * Converts a query string into an object, where each provided parameter is
 * turned into a key/value pair. Handles duplicate parameters by adding them
 * to an Array.
 *
 * @param  {String} qs the query string
 * @return {Object}
 */
export default function parseQueryString(qs) {
  const obj = Object.create(null);

  if (!qs) return obj;

  // Remove any leading ?, #, or &
  qs = qs.trim().replace(/^(\?|#|&)/, '');
  qs = qs.split('&');

  qs.forEach(p => {
    const [key, value] = p.split('=').map(decodeURIComponent);

    if (!obj[key]) {
      obj[key] = value;
    } else {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }

      obj[key].push(value);
    }
  });

  return obj;
}
