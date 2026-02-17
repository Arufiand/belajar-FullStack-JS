'use strict';
const express = require('express');
const { RequestLogger } = require('./utils/request_logger');

const app = express();
const cors = require('cors');
const notesRouter = require('./routes/note_router');
const phonebookRouter = require('./routes/phonebook_router');
const phonebookInfoRouter = require('./routes/phonebook_info_router');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');
const logger = require('./utils/logger');

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
