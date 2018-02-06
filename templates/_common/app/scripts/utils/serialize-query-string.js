/**
 * Shorter reference to encodeURIComponent.
 *
 * @private
 * @type {Function}
 */
const encode = encodeURIComponent;

/**
 * Converts an object of key/value pairs into a encoded query string.
 *
 * @param  {Object} params The params of the query string
 * @return {String}
 */
export default function serializeQueryString(params) {
  if (!params) return '';

  return Object.keys(params)
    .sort()
    .map(function(key) {
      const val = params[key];

      if (val === undefined) return '';
      if (val === null) return encode(key);

      if (Array.isArray(val)) {
        const result = [];
        let containsNull = false;

        val.forEach(function(v) {
          if (v === undefined) return;

          if (v === null) {
            containsNull = true;
            return;
          } else {
            result.push(encode(v));
          }
        });

        if (result.length > 0) {
          return encode(key) + '=' + result.join(',');
        } else if (containsNull) {
          return encode(key);
        } else {
          return '';
        }
      }

      return encode(key) + '=' + encode(val);
    })
    .filter(function(s) {
      return s.length > 0;
    })
    .join('&');
}
