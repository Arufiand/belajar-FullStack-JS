'use strict';
const express = require('express');
const cors = require('cors');
const { RequestLogger } = require('./helpers/logger');
const {
  errorHandler,
  unknownEndpoint,
  getTokenFrom
} = require('./helpers/middleware');
const authRouter = require('./routers/router.auth');
const usersRouter = require('./routers/router.users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(RequestLogger);
app.use(getTokenFrom);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

module.exports = app;
