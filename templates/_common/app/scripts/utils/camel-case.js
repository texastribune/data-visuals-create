/**
 * Converts a string from dash or underscore separated to camelCase.
 *
 * @param  {String} str
 * @return {String}
 */
export default function camelCase(str) {
  // remove any dashes or underscores in the string, and grab the following character
  return str.replace(/[-_]+(\w?)/g, (match, p1) => {
    // uppercase the following letter
    return p1.toUpperCase();
  });
}
