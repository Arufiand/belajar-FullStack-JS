'use strict';
const express = require('express');
const cors = require('cors');
const { RequestLogger } = require('./helpers/logger');
const {
  errorHandler,
  unknownEndpoint,
  getTokenFrom
} = require('./helpers/middleware');
const { listRoutes } = require('./helpers/generalHelper');
const authRouter = require('./routers/router.auth');
const usersRouter = require('./routers/router.users');

// Ensure all models are registered with Mongoose
require('./models/notes');
require('./models/blogs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(RequestLogger);
app.use(getTokenFrom);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'development') {
  app.get('/api/routes', (req, res) => {
    const routes = listRoutes([
      { prefix: '/api/auth', router: authRouter },
      { prefix: '/api/users', router: usersRouter }
    ]);
    res.json(routes);
  });
}

app.use(unknownEndpoint);
app.use(errorHandler);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

module.exports = app;
