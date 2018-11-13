/**
 * A quick and easy way to establish a cached reference to linking a ref in
 * Preact.
 * @param {object} obj
 * @param {string} name
 * @returns {Element}
 * @example
 *
 * <input ref={linkRef(this, 'myInput')} />
 */
export function linkRef(obj, name) {
  const refName = `$$ref_${name}`;
  let ref = obj[refName];

  if (!ref) {
    ref = obj[refName] = c => {
      obj[name] = c;
    };
  }

  return ref;
}
