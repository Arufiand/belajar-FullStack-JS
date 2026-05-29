function urlJoiner(base = '', path = '') {
  if (!base) throw new Error('MONGOURL is required');
  // Split base into the URL part and query string
  const [baseUrl, queryString] = base.split('?');
  const b = baseUrl.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  const joined = `${b}/${p}`;
  return queryString ? `${joined}?${queryString}` : joined;
}

const listRoutes = (routers) => {
  const routes = [];
  routers.forEach(({ prefix, router }) => {
    router.stack.forEach(layer => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
        routes.push({ method: methods.join(','), path: prefix + layer.route.path });
      }
    });
  });
  return routes;
};

module.exports = { urlJoiner, listRoutes };
