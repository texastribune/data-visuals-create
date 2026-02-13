import { h, Component } from 'preact';
import { apdate } from 'journalize';

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      altText: '',
    };
  }

  componentDidMount() {
    const { _links } = this.props;
    const href = _links['wp:featuredmedia'][0].href;
    if (!href) return;

    fetch(href)
      .then(res => res.json())
      .then(images => {
        let finalAlt = '';

        if (images.alt_text) {
          finalAlt = images.alt_text;
        } else if (images.media_details.image_meta.caption) {
          finalAlt = images.media_details.image_meta.caption;
        } else if (typeof images.caption.rendered == 'string') {
          finalAlt = images.caption.rendered.replace(/<[^>]+>/g, '');
        } else {
          finalAlt = 'Image for article';
        }

        this.setState({ altText: finalAlt });
      })
      .catch(err => {
        console.error('Error fetching media:', err);
        this.setState({ altText: 'Image for article' });
      });
  }

  render({ title, link, date, jetpack_featured_media_url }, { altText }) {
    return (
      <article class="story">
        <a
          class="story-link dim"
          href={link}
          target="_blank"
          ga-event-category="read more"
          ga-event-action="automated by tag"
          ga-event-label="apps page"
        >
          <div class="story-media c-story-block">
            <div class="story-art c-story-block__image-wrap">
              <img
                src={jetpack_featured_media_url}
                alt={altText}
                class="l-width-full"
              />
            </div>
            <div class="story-text c-story-block__text">
              <header class="story-header">
                <h4 class="story-headline t-serif t-size-b t-lh-s has-xxxs-btm-marg">
                  {title['rendered']}
                </h4>
                <p class="story-byline t-byline t-links t-uppercase t-lsp-m t-size-xs has-text-gray-dark">
                  {apdate(new Date(date))}
                </p>
              </header>
            </div>
          </div>
        </a>
      </article>
    );
  }
}

export default Story;
