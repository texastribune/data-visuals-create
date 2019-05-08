import { Component, h } from 'preact';
import { widont } from 'journalize';

import getCurrentUrl from '../utils/get-current-url';
import throttle from '../utils/throttle';
import { TRENDING_STORIES_URL } from '../utils/feeds';

class Ribbon extends Component {
  constructor() {
    super();

    this.state = {
      loadSucceeded: false,
      scrollingDown: false,
      stories: [],
    };

    this.previousYOffset = -1;
    this.onScroll = this.onScroll.bind(this);
    this.throttledOnScroll = throttle(this.onScroll, 300);
  }

  onScroll() {
    const pageYOffset = window.pageYOffset;
    const previousYOffset = this.previousYOffset;

    let scrollingDown;

    if (pageYOffset > previousYOffset) {
      scrollingDown = true;
    } else if (pageYOffset < previousYOffset) {
      scrollingDown = false;
    }

    this.previousYOffset = pageYOffset;
    this.setState({ scrollingDown });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.throttledOnScroll, false);

    fetch(TRENDING_STORIES_URL)
      .then(res => res.json())
      .then(data => {
        const stories = data.results ? data.results : data;

        this.setState({ loadSucceeded: true, stories });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledOnScroll, false);
  }

  render(_, { loadSucceeded, scrollingDown, stories }) {
    let navClass = scrollingDown ? 'ribbon ribbon--inactive' : 'ribbon';

    if (!loadSucceeded) {
      navClass += ' ribbon--hidden';
    }

    const currentUrl = getCurrentUrl();
    stories = stories.filter(story => story.url !== currentUrl);

    return (
      <nav class={navClass}>
        <p class="ribbon__title">
          Trending on{' '}
          <a href="https://www.texastribune.org/">The Texas Tribune</a>
        </p>
        <ul class="ribbon__stories">
          {stories.slice(0, 4).map((story, i) => {
            let storyClass = 'ribbon__story';

            if (i === 2) storyClass += ' ribbon__story--three';
            if (i === 3) storyClass += ' ribbon__story--four';

            return (
              <li
                key={story.id}
                class={storyClass}
                ga-event-category="read more"
                ga-event-action="trending"
                ga-event-label="apps page"
              >
                <a href={story.url}>{widont(story.headline)}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Ribbon;
