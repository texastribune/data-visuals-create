/**
 * Select an element on the page. Uses `document.querySelector`, meaning it
 * will only return the first element that matches.
 *
 * @param {String} el The CSS selector to search for.
 * @param {Element} [context] The container to search within. Defaults to
 * `document`.
 * @returns {Element|null}
 */
function select(el, context) {
  return typeof el === 'string'
    ? (context || document).querySelector(el)
    : el || null;
}

export default select;
