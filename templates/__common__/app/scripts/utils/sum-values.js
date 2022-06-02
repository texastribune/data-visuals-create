/**
 * Sums up values of a property across objects in an array.
 *
 * @param {Array} arr An array of objects.
 * @param {String} key The property to sum across objects.
 * @return {Number}
 */
export default function sumValues(arr, key) {
  return arr.reduce((acc, obj) => acc + obj[key], 0);
}
