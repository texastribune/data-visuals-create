/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import _ from 'lodash';

// main code for feature graphics

function resize() {
  // code executed on window resize
}

// call resize on load
resize();
window.addEventListener('resize', _.debounce(resize, 200));
