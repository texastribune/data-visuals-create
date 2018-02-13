/* global pym */
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
  renderGraphic(frameWidth || 600, pymChild);

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

// The `onLoad` function is called once the child page's HTML/DOM, stylesheets
// and images have finished loading.
window.onload = onLoad;
