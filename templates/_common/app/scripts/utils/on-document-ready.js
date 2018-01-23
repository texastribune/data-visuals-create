/**
 * @private
 * @return {Boolean}
 */
function documentIsReady() {
  return (
    document.readyState !== 'loading' && document.readyState !== 'uninitialized'
  );
}

/**
 * Provides a hook for a callback to be called once the document's DOM is
 * interactive, but *before* all sub-resources are ready.
 *
 * @param  {Function} callback
 */
function onDocumentReady(callback) {
  var isReady = documentIsReady();
  // if the page isn't ready, let's set up a readystatechange event
  if (!isReady) {
    // set up our listener function so we can unset it once we use it
    var readyListener = function() {
      if (documentIsReady()) {
        if (!isReady) {
          isReady = true;
          callback();
        }
        // remove the listener
        document.removeEventListener('readystatechange', readyListener, false);
      }
    };

    // set up the readystatechange listener
    document.addEventListener('readystatechange', readyListener, false);
  } else {
    callback();
  }
}

export default onDocumentReady;
