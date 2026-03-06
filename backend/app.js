'use strict';
const express = require('express');
const cors = require('cors');
const { RequestLogger } = require('./utils/request_logger');
const notesRouter = require('./controllers/note_router');
const phonebookRouter = require('./controllers/phonebook_router');
const phonebookInfoRouter = require('./controllers/phonebook_info_router');
const blogRouter = require('./controllers/blog_router');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(RequestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/persons', phonebookRouter);
app.use('/api/info', phonebookInfoRouter);
app.use('/api/blogs', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

module.exports = app;
