/* global pym */
import onDocumentReady from './utils/on-document-ready';
// import onDocumentComplete from './utils/on-document-complete';

import renderGraphic from './graphic';

/**
 * Variable for pym instance.
 */
let pymChild;

/**
 * Called to render the graphic on the page once pym has initialized.
 *
 * Your code goes here!
 *
 * @param  {Number} frameWidth The width of the embedded iframe
 * @return {void}
 */
function render(frameWidth) {
  renderGraphic(frameWidth, pymChild);

  if (pymChild) {
    pymChild.sendHeight();
  }
}

/**
 * Called via `onDocumentReady` or `onDocumentComplete` once the embed
 * is ready for pym to be set up and build the graphic.
 *
 * @return {void}
 */
function onLoad() {
  pymChild = new pym.Child({
    renderCallback: render,
  });

  // let the parent page know that the embed has loaded
  pymChild.sendMessage('childLoaded', 'ready');
}

// Called once the child page's HTML/DOM has loaded, but BEFORE any stylesheets
// or images have finished. You typically want this, because it will make your
// embed load much quicker.
onDocumentReady(onLoad);

// However, if your graphic depends on images, you should comment out the
// `onDocumentReady` import up top and the `onDocumentReady` line above, and
// uncomment the `onDocumentComplete` import and the `onDocumentComplete`
// below. This will ensure pym waits for all of your images before calculating
// the page's height.
// onDocumentComplete(onLoad);
