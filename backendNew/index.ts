'use strict';
import * as logger from './src/helpers/logger';
import { PORT, startConnection } from './src/core/databaseConfig';
import app from './src/app';

const index = async () => {
  try {
    await startConnection({ dbEnvName: 'FULLSTACKDB' });
    app.listen(PORT, () => {
      logger.info('Server started on port', PORT);
    });
  } catch (error) {
    logger.error(
      'failed to start server due to DB Connection Error :',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};
index();
