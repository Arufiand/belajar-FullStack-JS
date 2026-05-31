import { Router } from 'express';

function urlJoiner(base = '', path = ''): string {
  if (!base) throw new Error('MONGOURL is required');
  const [baseUrl, queryString] = base.split('?');
  const b = baseUrl.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  const joined = `${b}/${p}`;
  return queryString ? `${joined}?${queryString}` : joined;
}

interface RouterEntry {
  prefix: string;
  router: Router;
}

interface RouteInfo {
  method: string;
  path: string;
}

const listRoutes = (routers: RouterEntry[]): RouteInfo[] => {
  const routes: RouteInfo[] = [];
  routers.forEach(({ prefix, router }) => {
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).map((m: string) =>
          m.toUpperCase()
        );
        routes.push({
          method: methods.join(','),
          path: prefix + layer.route.path
        });
      }
    });
  });
  return routes;
};

export { urlJoiner, listRoutes };
