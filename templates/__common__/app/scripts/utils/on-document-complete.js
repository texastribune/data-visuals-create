/**
 * @private
 * @return {Boolean}
 */
function documentIsComplete() {
  return document.readyState === 'complete';
}

/**
 * Provides a hook for a callback to be called once the document's content has
 * completely loaded.
 *
 * @param  {Function} callback
 */
function onDocumentComplete(callback) {
  var isComplete = documentIsComplete();
  // if the page isn't complete, let's set up a readystatechange event
  if (!isComplete) {
    // set up our listener function so we can unset it once we use it
    var readyListener = function() {
      if (documentIsComplete()) {
        if (!isComplete) {
          isComplete = true;
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

export default onDocumentComplete;
