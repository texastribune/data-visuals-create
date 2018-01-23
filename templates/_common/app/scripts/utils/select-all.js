/* global Node, Window */

/**
 * Select all matching elements on the page. Uses `document.querySelectorAll`.
 *
 * @param {String} el The CSS selector to search for.
 * @param {Element} [context] The container to search within. Defaults to
 * `document`.
 * @returns {Element[]}
 */
function selectAll(el, context) {
  // if `el` is a Node or Window, return it in an Array
  if (el instanceof Node || el instanceof Window) return [el];

  return Array.prototype.slice.call(
    typeof el === 'string'
      ? (context || document).querySelectorAll(el)
      : el || []
  );
}

export default selectAll;
