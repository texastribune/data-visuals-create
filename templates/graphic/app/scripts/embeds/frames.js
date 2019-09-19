// packages
import { initFrame } from '@newswire/frames';

// local
import debounce from '../utils/debounce';

/**
 * Sets up an instance of a frame and executes a function, i.e. a function to render the graphic.
 *
 * @param {Function} [fn] An optional function to be called on load and resize
 */
export function frameLoader(fn) {
  if (fn) {
    // set up a debounced version
    const debouncedFn = debounce(fn, 300);

    // resize listener
    window.addEventListener('resize', debouncedFn);

    // if fn() renders a graphic, it needs to come before initFrame() so the correct frame height is set
    fn();
    initFrame();
  } else {
    // if no function was passed, initialize the frame anyway
    initFrame();
  }
}
