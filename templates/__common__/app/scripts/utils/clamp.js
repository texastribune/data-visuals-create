/**
 * Returns the minimum if n is less than the minimum.
 * Returns the maximum if n is more than the maximum.
 * Returns n if n is between the minimum and maximum.
 *
 * @param {Number} n
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
export default function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
