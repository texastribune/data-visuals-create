const TRENDING_STORIES_URL =
  'https://www.texastribune.org/api/v2/articles/most_viewed/?format=json&limit=5';
const BUILD_RELATED_CONTENT_URL = ({ gutenTag, numberOfStories = 4 }) =>
  `https://www.texastribune.org/api/v2/articles/?content_type=story,audio,video,pointer&tag=${gutenTag}&tag!=object-tribcast&fields=id,url,pub_date,headline,summary,sitewide_image&limit=${numberOfStories}&format=json`;

// Newspack API base URL
let BASE_NEWSPACK_API = 'https://www.texastribune.org/wp-json/wp/v2/';

const BUILD_RELATED_CONTENT_URL_NEWSPACK = ({
  taxonomy,
  item,
  numberOfStories = 4,
}) =>
  `${BASE_NEWSPACK_API}posts?
${taxonomy}=${item}&per_page=${numberOfStories}&orderby=date&order=desc`;

// Function to map taxonomy (categories or tags) to get the item ID
export async function mappingTaxonomy(type, string) {
  // pick either categories or tags
  const perPage = 100;

  const base = `${BASE_NEWSPACK_API}${type}`;

  // We get the total number of pages, total entries and first page
  const firstRes = await fetch(`${base}?per_page=${perPage}&page=1`);

  const total = Number(firstRes.headers.get('X-WP-Total'));
  const totalPages = Number(firstRes.headers.get('X-WP-TotalPages'));

  const firstPage = await firstRes.json();

  const pageNums = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, i) => i + 2
  );

  const promises = pageNums.map(p =>
    fetch(`${base}?per_page=${perPage}&page=${p}`).then(r => r.json())
  );

  const restPages = await Promise.all(promises);

  // put all of rest together
  const all = firstPage.concat(...restPages);

  // Find the category or tag we want
  const item = all.find(item => item.slug === string);

  return { total, totalPages, fetched: item, type };
}

export {
  BUILD_RELATED_CONTENT_URL,
  BUILD_RELATED_CONTENT_URL_NEWSPACK,
  TRENDING_STORIES_URL,
};
