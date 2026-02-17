import { h, render } from 'preact';

// just in case this gets removed
window.ttData = window.ttData || {};

// related content
const relatedContentContainer = document.getElementById(
  'related-content-container'
);

if (relatedContentContainer && window.ttData.related_category) {
  import(
    /* webpackChunkName: "RelatedContent" */ './components/RelatedContent'
  ).then(({ default: RelatedContent }) =>
    render(
      <RelatedContent
        title={'Read more'}
        related_category={window.ttData.related_category}
      />,
      relatedContentContainer
    )
  );
}

// trending ribbon
// const ribbonContainer = document.getElementById('ribbon-container');

// if (ribbonContainer) {
//   import(/* webpackChunkName: "Ribbon" */ './components/Ribbon').then(
//     ({ default: Ribbon }) => render(<Ribbon />, ribbonContainer)
//   );
// }

// ads
import(/* webpackChunkName: "ads" */ './utils/ad-loader').then(
  ({ default: AdLoader }) => {
    const ads = new AdLoader({
      targetingKey: 'tribpedia',
      targetingValue: window.ttData.targetingValue,
    });
    ads.init();
  }
);
