/**
 * Gets all the attributes set on an element, and returns them as an Object.
 *
 * @param  {Element} element
 * @return {Object}
 */
export default function getAttributes(element) {
  const attrs = {};

  // if element is empty, or not ELEMENT_NODE, eject
  if (!element || element.nodeType !== 1) return attrs;

  // grab all the attributes off the element
  const map = element.attributes;

  // if there are no attributes, eject
  if (map.length === 0) return attrs;

  // loop through the attributes and build the object
  for (var i = 0; i < map.length; i++) {
    attrs[map[i].name] = map[i].value;
  }

  return attrs;
}
