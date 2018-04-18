/**
 * Gets the last element of `array`.
 *
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * last([1, 2, 3]);
 * // => 3
 */
export default function last(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}
