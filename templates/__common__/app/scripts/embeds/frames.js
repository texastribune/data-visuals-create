// packages
import { initFrame } from '@newswire/frames';

/**
 * Sets up an instance of a frame and executes a function, i.e. a function to render the graphic.
 *
 * @param {Function} [fn] An optional function to be called on load and resize
 */
export function frameLoader(fn) {
  // initialize frame no matter what
  // sends height to parent container
  initFrame();

  if (fn) {
    // resize listener
    window.addEventListener('resize', fn);
    fn();
  }
}
