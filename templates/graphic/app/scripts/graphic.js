import * as d3 from 'd3';

// a reference to the default graphic container, change if needed
const container = d3.select('#graphic');

// a helper function to clear the container of its contents
const clearContainer = () => container.html('');

// a helper function to grab the container's width
const getFrameWidth = () => container.node().offsetWidth;

/**
 * This function is called to render a graphic by Pym.js. The frame's width and
 * a reference to the Pym instance is provided.
 *
 * @param  {Object} pymChild         A reference to the iframe's Pym instance
 * @return {void}
 */
export default function renderGraphic(pymChild) {
  // uncomment these two lines if you're creating a coded graphic
  // clearContainer(); // clears the container
  // const frameWidth = getFrameWidth(); // calcuates the width on each render
}
