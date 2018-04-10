import camelCase from './camel-case';
import getAttributes from './get-attributes';

/**
 * Searches an element's attributes and returns an Object of all the ones that
 * begin with a specified prefix. Each matching attribute name is returned
 * without the prefix, with the remainder converted to camelCase.
 *
 * @param  {Element} element
 * @param  {String} prefix
 * @return {Object}
 */
export default function getMatchingAttributes(element, prefix) {
  // get all the attributes on the element
  const attributes = getAttributes(element);
  const fields = {};

  // loop through the keys of the attributes
  Object.keys(attributes).forEach(function(key) {
    // continue if the key begins with supplied prefix
    if (key.substr(0, prefix.length) === prefix) {
      // grab the value associated with the original key
      const value = attributes[key];

      // slice off the prefix and camelCase what is left
      const field = camelCase(key.slice(prefix.length));

      fields[field] = value;
    }
  });

  return fields;
}
