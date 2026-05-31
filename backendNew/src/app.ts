'use strict';
import express from 'express';
import cors from 'cors';
import { RequestLogger } from './helpers/logger';
import {
  errorHandler,
  unknownEndpoint,
  getTokenFrom
} from './helpers/middleware';
import { listRoutes } from './helpers/generalHelper';
import authRouter from './routers/auth.router';
import usersRouter from './routers/user.router';

// Ensure all models are registered with Mongoose
require('./models/notes';
import notesRouter from './routers/notes.router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(RequestLogger);
app.use(getTokenFrom);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);

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

exports = app;
