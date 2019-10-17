import { h, render } from 'preact';

// just in case this gets removed
window.ttData = window.ttData || {};

// related content
const relatedContentContainer = document.getElementById(
  'related-content-container'
);

if (relatedContentContainer && window.ttData.gutenTag) {
  import(
    /* webpackChunkName: "RelatedContent" */ './components/RelatedContent'
  ).then(({ default: RelatedContent }) =>
    render(
      <RelatedContent title={'Read more'} gutenTag={window.ttData.gutenTag} />,
      relatedContentContainer
    )
  );
}

// trending ribbon
const ribbonContainer = document.getElementById('ribbon-container');

if (ribbonContainer) {
  import(/* webpackChunkName: "Ribbon" */ './components/Ribbon').then(
    ({ default: Ribbon }) => render(<Ribbon />, ribbonContainer)
  );
}

// ads
import(/* webpackChunkName: "ads" */ './utils/ad-loader').then(
  ({ default: AdLoader }) => {
    const ads = new AdLoader();
    ads.init();
  }
);
