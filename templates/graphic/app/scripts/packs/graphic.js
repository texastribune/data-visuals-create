import * as d3 from 'd3';
import createBase from '../utils/d3-base';

// a reference to the default graphic container, change if needed
const container = d3.select('#graphic');

// a helper function to clear the container of its contents
const clearContainer = () => container.html('');

// a helper function to grab the container's width
const getFrameWidth = () => container.node().offsetWidth;

// add code here that should be rendered ONCE, i.e creating an SVG
// use createBase() to create the base of an d3 chart

/**
 * This function is called to render a graphic on RESIZE by the frame loader.
 *
 * @return {void}
 */
export default function renderGraphic() {
  // uncomment these two lines if you're creating a coded graphic
  // pass the recalculated frameWidth to parts of your chart (like an axis) that change with resize!
  // clearContainer();
  // const frameWidth = getFrameWidth();
}
