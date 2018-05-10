const TRENDING_STORIES_URL =
  'https://www.texastribune.org/api/v1/content/most_viewed/?format=json&limit=5';
const BUILD_RELATED_CONTENT_URL = ({ gutenTag, numberOfStories = 4 }) =>
  `https://www.texastribune.org/api/v1/content/?content_type=story,audio,video,pointer&tag=${gutenTag}&tag!=object-tribcast&fields=id,url,readable_pub_date,headline,short_summary,lead_art&limit=${numberOfStories}&format=json`;

export { BUILD_RELATED_CONTENT_URL, TRENDING_STORIES_URL };
