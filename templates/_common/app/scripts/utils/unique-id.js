/**
 * Counter used by {uniqueId} to iterate.
 * @private
 * @type {Number}
 */
let idCounter = 0;

/**
 * Generates identifiers unique to a single browser session. Each time it runs,
 * the integer at the end of the return value will increment.
 *
 * Borrowed from underscore.js: http://underscorejs.org/#uniqueId
 *
 * @param  {String} [prefix] Optional prefix for identifier
 * @return {String}
 * @example
 *
 * var identifier = uniqueId();
 * // returns '1'
 *
 * var prefixedIdentifier = uniqueId('label-');
 * // returns 'label-2'
 */
export default function uniqueId(prefix) {
  const id = ++idCounter + '';
  return prefix ? prefix + id : id;
}
