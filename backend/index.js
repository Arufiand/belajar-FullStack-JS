'use strict';
const logger = require('./utils/logger');
const { PORT, connectIfNeeded } = require('./utils/config');
const app = require('./app');

// Start the server only after establishing a MongoDB connection
const start = async () => {
  try {
    await connectIfNeeded({ dbEnvName: 'FULLSTACKDB' });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(
      'Failed to start server due to DB connection error:',
      err && err.message ? err.message : err
    );
    process.exit(1);
  }
};

start();
