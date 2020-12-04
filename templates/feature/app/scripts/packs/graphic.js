/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import _ from 'lodash';

// main code for feature graphics
// a reference to the default graphic container, change if needed
const container = d3.select('#graphic');

// a helper function to clear the container of its contents
const clearContainer = () => container.html('');

// a helper function to grab the container's width
const getFrameWidth = () => container.node().offsetWidth;

// import data by getting the window variable, OR by importing the filepath
// let data = window.DATA;
// import data from '../../../data/data.json';

function resize() {
  // code executed on window resize
  // pass the recalculated frameWidth to parts of your chart (like an axis) that change with resize!
  clearContainer();
  const frameWidth = getFrameWidth();
}

// call resize on load
resize();
window.addEventListener('resize', _.debounce(resize, 200));
