import { h, render } from 'preact';

import(/* webpackChunkName: "analytics" */ '@data-visuals/analytics').then(
  analytics => analytics.init()
);

const ribbonContainer = document.getElementById('ribbon-container');

if (ribbonContainer) {
  import(/* webpackChunkName: "Ribbon" */ './components/Ribbon').then(
    ({ default: Ribbon }) => render(<Ribbon />, ribbonContainer)
  );
}

/**
 * Your code belongs here.
 */
