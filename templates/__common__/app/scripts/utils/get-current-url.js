function getCurrentUrl() {
  const loc = window.location;
  return `${loc.protocol}//${loc.host}${loc.pathname}`;
}

export default getCurrentUrl;
