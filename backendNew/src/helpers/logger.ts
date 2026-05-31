import { Request, Response, NextFunction } from 'express';

const info = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') console.info(...params);
};
const error = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') console.error(...params);
};
const warn = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') console.warn(...params);
};

const RequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1e3 + diff[1] / 1e6;
    info('Method', req.method);
    info('Path', req.path);
    info('Body', req.body);
    info('Url', req.url);
    info('Status code', res.statusCode);
    info('Response Time', ms.toFixed(3) + ' ms');
    const hdr = res.getHeader && res.getHeader('X-Response-Time');
    if (hdr) info('X-Response-Time header:', hdr);
    info('---');
  });
  next();
};

export { info, error, warn, RequestLogger };
