'use strict';
const express = require('express');
const { RequestLogger } = require('./utils/request_logger');

const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/note_router');
const phonebookRouter = require('./controllers/phonebook_router');
const phonebookInfoRouter = require('./controllers/phonebook_info_router');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');
const logger = require('./utils/logger');
const { PORT, connectIfNeeded } = require('./utils/config');

app.use(cors());
app.use(express.json());
app.use(RequestLogger);
app.use('/api/notes', notesRouter);
app.use('/api/persons', phonebookRouter);
app.use('/api/info', phonebookInfoRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// Start the server only after establishing a MongoDB connection
const start = async () => {
  try {
    // attempt to connect using the PHONEBOOK_DB env var if present;
    // if you use NOTES controllers as a separate app, adjust accordingly
    await connectIfNeeded({ dbEnvName: 'PHONEBOOK_DB' });

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
