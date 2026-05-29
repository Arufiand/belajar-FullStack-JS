function urlJoiner(base = '', path = '') {
  if (!base) throw new Error('MONGOURL is required');
  // Split base into the URL part and query string
  const [baseUrl, queryString] = base.split('?');
  const b = baseUrl.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  const joined = `${b}/${p}`;
  return queryString ? `${joined}?${queryString}` : joined;
}

module.exports = { urlJoiner };
