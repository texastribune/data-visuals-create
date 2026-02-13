import { Component, h } from 'preact';
import Story from './Story';
import {
  BUILD_RELATED_CONTENT_URL_NEWSPACK,
  mappingTaxonomy,
} from '../utils/feeds';

class RelatedContent extends Component {
  constructor() {
    super();
    this.state = {
      stories: [],
    };
  }

  componentDidMount() {
    const { related_category, numberOfStories, taxonomy } = this.props;

    mappingTaxonomy(taxonomy, related_category)
      .then(term => {
        if (!term) {
          console.warn('No term found for tag or category');
          return;
        }

        const itemId = term['fetched']['id'];
        const taxonomyParam = taxonomy;

        const url = BUILD_RELATED_CONTENT_URL_NEWSPACK({
          taxonomy: taxonomyParam,
          item: itemId,
          numberOfStories,
        });

        return fetch(url)
          .then(res => res.json())
          .then(posts => {
            this.setState({ stories: posts });
          });
      })
      .catch(err => console.error('related content error:', err));
  }

  render({ title }, { stories }) {
    return (
      <section class="related-stories">
        <p class="related-content__title t-sectionhead t-uppercase t-lsp-b t-weight-bold has-b-btm-marg t-size-b">
          {title}
        </p>
        <nav class="stories l-col-grid l-col-grid--1x1-until-bp-m">
          {stories.map(story => (
            <Story key={story.id} {...story} />
          ))}
        </nav>
      </section>
    );
  }
}

RelatedContent.defaultProps = {
  numberOfStories: 4,
  title: 'Read more',
  // either categories or tags
  taxonomy: 'categories',
};

export default RelatedContent;
