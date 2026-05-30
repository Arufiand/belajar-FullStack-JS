'use strict';
const logger = require('./src/helpers/logger');
const { PORT, startConnection } = require('./src/core/databaseConfig');
const app = require('./src/app');

const index = async () => {
  try {
    await startConnection({ dbEnvName: 'FULLSTACKDB' });
    app.listen(PORT, () => {
      logger.info('Server started on port', PORT);
    });
  } catch (error) {
    logger.error(
      'failed to start server due to DB Connection Error :',
      error && error.message ? error.message : error
    );
    process.exit(1);
  }
};
index();
