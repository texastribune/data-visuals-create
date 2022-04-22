/**
 * Returns current URL as a String.
 *
 * @return {String}
 */
function getCurrentUrl() {
  const loc = window.location;
  return `${loc.protocol}//${loc.host}${loc.pathname}`;
}

export default getCurrentUrl;
