import { Component, h } from 'preact';

import Story from './Story';

import { BUILD_RELATED_CONTENT_URL } from '../utils/feeds';

class RelatedContent extends Component {
  constructor() {
    super();

    this.state = {
      stories: [],
    };
  }

  componentDidMount() {
    const { gutenTag, numberOfStories } = this.props;

    fetch(BUILD_RELATED_CONTENT_URL({ gutenTag, numberOfStories }))
      .then(res => res.json())
      .then(({ results: stories }) => this.setState({ stories }));
  }

  render({ title }, { stories }) {
    return (
      <section class="related-stories">
        <p class="related-content__title">{title}</p>
        <nav class="stories">
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
};

export default RelatedContent;
