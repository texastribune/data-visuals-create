/* global pym */

// local
import debounce from '../utils/debounce';
import loadScript from '../utils/load-script';

const PYM_SRC_URL = 'https://pym.nprapps.org/pym.v1.min.js';

/**
 * Load the Pym.js script and return a new instance of pym.Child.
 *
 * @returns {Promise<object>}
 */
async function getPymChild() {
  await loadScript(PYM_SRC_URL);

  return new pym.Child();
}

/**
 * A wrapper around loading Pym.js async and hooking up the callback
 * function, if provided.
 *
 * @param {Function} [fn] an optional render function to be hooked into Pym.js
 * @returns {Promise<void>}
 */
export async function pymLoader(fn) {
  const pymChild = await getPymChild();

  if (fn) {
    const debouncedFn = debounce(() => {
      fn();

      pymChild.sendHeight();
    }, 300);

    window.addEventListener('resize', debouncedFn);
    window.addEventListener('load', debouncedFn);

    debouncedFn();
  }
}
