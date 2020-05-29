const TRENDING_STORIES_URL =
  'https://www.texastribune.org/api/v2/articles/most_viewed/?format=json&limit=5';
const BUILD_RELATED_CONTENT_URL = ({ gutenTag, numberOfStories = 4 }) =>
  `https://www.texastribune.org/api/v2/articles/?content_type=story,audio,video,pointer&tag=${gutenTag}&tag!=object-tribcast&fields=id,url,pub_date,headline,summary,sitewide_image&limit=${numberOfStories}&format=json`;

export { BUILD_RELATED_CONTENT_URL, TRENDING_STORIES_URL };
