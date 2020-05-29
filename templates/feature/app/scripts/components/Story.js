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
        <div class="story-media">
          <div class="story-art">
            <img
              src={sitewide_image.thumbnails.letterbox}
              alt={sitewide_image.description}
            />
          </div>
          <div class="story-text">
            <header class="story-header">
              <h4 class="story-headline">{headline}</h4>
              <p class="story-byline">{apdate(new Date(pub_date))}</p>
            </header>
          </div>
        </div>
      </a>
    </article>
  );
};

export default Story;
