// packages
import { initFrame, sendFrameHeight } from '@newswire/frames';

// local
import debounce from '../utils/debounce';

/**
 * Sets up an instance of a frame and executes a function, i.e. a function to render the graphic.
 *
 * @param {Function} [fn] An optional function to be called on load and resize
 */
export function frameLoader(fn) {
  // initialize the frame no matter what
  initFrame();

  if (fn) {
    // set up a debounced version
    const debouncedFn = debounce(fn, 300);

    // resize listener
    window.addEventListener('resize', debouncedFn);

    // if fn() renders a graphic, it needs to come before the frame height is sent
    new Promise(resolve => {
      fn();
      resolve(sendFrameHeight());
    });
  }
}
