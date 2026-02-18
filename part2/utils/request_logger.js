const logger = require('./logger');
const RequestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1e3 + diff[1] / 1e6; // milliseconds with sub-ms precision
    logger.info('Method', req.method);
    logger.info('Path', req.path);
    logger.info('Body', req.body);
    logger.info('Url', req.url);
    logger.info('Status code', res.statusCode);
    logger.info('Response Time', ms.toFixed(3) + ' ms');

    const hdr = res.getHeader && res.getHeader('X-Response-Time');
    if (hdr) {
      logger.info('X-Response-Time header:', hdr);
    }
    logger.info('---');
  });

  next();
};

module.exports = { RequestLogger };
