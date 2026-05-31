import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as logger from './logger';

const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (
  err: Error & { name: string },
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.message);
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'invalid token' });
  } else if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'token expired' });
  } else {
    next(err);
  }
};

const getTokenFrom = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authorization = req.get('authorization');
  req.token = authorization?.toLowerCase().startsWith('bearer ')
    ? authorization.substring(7)
    : null;
  next();
};

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.token) {
    res.status(401).json({ error: 'token missing' });
    return;
  }
  try {
    req.user = jwt.verify(req.token, process.env.SECRET as string) as {
      username: string;
      id: string;
    };
    next();
  } catch (err) {
    next(err);
  }
};

export { unknownEndpoint, errorHandler, getTokenFrom, verifyToken };
