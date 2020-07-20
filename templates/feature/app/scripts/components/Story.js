import { h } from 'preact';
import { apdate } from 'journalize';

const Story = ({ headline, url, pub_date, sitewide_image }) => {
  return (
    <article class="story">
      <a
        class="story-link dim"
        href={url}
        target="_blank"
        ga-event-category="read more"
        ga-event-action="automated by tag"
        ga-event-label="apps page"
      >
        <div class="story-media c-story-block">
          <div class="story-art c-story-block__image-wrap">
            <img
              src={sitewide_image.thumbnails.letterbox}
              alt={sitewide_image.description}
              class="l-width-full"
            />
          </div>
          <div class="story-text c-story-block__text">
            <header class="story-header">
              <h4 class="story-headline t-serif t-size-b t-lh-s has-xxxs-btm-marg">{headline}</h4>
              <p class="story-byline t-byline t-links t-uppercase t-lsp-m t-size-xs has-text-gray-dark">{apdate(new Date(pub_date))}</p>
            </header>
          </div>
        </div>
      </a>
    </article>
  );
};

export default Story;
