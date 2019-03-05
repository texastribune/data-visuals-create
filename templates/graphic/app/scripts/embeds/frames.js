// packages
import { initFrame } from '@newswire/frames';

// local
import debounce from '../utils/debounce';

/**
 * Sets up an instance of a frame.
 *
 * @param {Function} [fn] An optional function to be called on resize
 */
export function frameLoader(fn) {
  // activate the frame
  initFrame();

  // only needed if a function was provided
  if (fn) {
    // set up a debounced version
    const debouncedFn = debounce(fn, 300);

    // resize listener
    window.addEventListener('resize', debouncedFn);

    // initial kickoff
    debouncedFn();
  }
}
