/**
 * A helper for asynchronously loading scripts.
 *
 * Provides a Promise interface for passing a function that will only be called
 * if the script is successfully added to the page.
 *
 * @private
 * @param {String} url The URL for the script to be loaded.
 * @returns {Promise}
 * @example
 *
 * loadScript('backup.js').then(() => {
 *   // anything that depends on that script loading
 * });
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    // create the `script` element
    const script = document.createElement('script');

    // set its URL
    script.src = url;

    // should always be async
    script.async = true;

    // resolve the Promise on load
    script.onload = resolve;

    // reject the Promise if there is an error
    script.onerror = reject;

    // attach the script to the document body
    document.body.appendChild(script);
  });
}

export default loadScript;
