import dotenv from 'dotenv';

dotenv.config({ override: false });

import mongoose from 'mongoose';
import { urlJoiner } from '../helpers/generalHelper';
import * as logger from '../helpers/logger';
import { StartConnectionOptions } from '../constants/databaseConfig.interfaces';

mongoose.set('strictQuery', false);

let _connecting: Promise<typeof mongoose> | null = null;
let _connectedUrl: string | null = null;

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGOURL;

const DEFAULT_DB_ENV_KEY: string =
  process.env.NODE_ENV === 'test' ? 'FULLSTACKDBTEST' : 'FULLSTACKDB';

const buildUrl = (dbEnvName?: string): string | null => {
  const fullUrl = process.env.MONGODB_URI || MONGO_URL;
  if (dbEnvName && /^mongodb(\+srv)?:\/\//.test(dbEnvName)) return dbEnvName;

  if (!fullUrl) {
    if (!dbEnvName) return null;
    if (
      process.env[dbEnvName] &&
      /^mongodb(\+srv)?:\/\//.test(process.env[dbEnvName] as string)
    ) {
      return process.env[dbEnvName] as string;
    }
    return null;
  }

  const envKey = dbEnvName || DEFAULT_DB_ENV_KEY;

  if (!envKey) return fullUrl;

  const dbCandidate =
    process.env[envKey] !== undefined ? process.env[envKey] : envKey;

  if (/^mongodb(\+srv)?:\/\//.test(dbCandidate as string))
    return dbCandidate as string;

  return urlJoiner(fullUrl, dbCandidate as string);
};

const startConnection = async (
  options: StartConnectionOptions = {}
): Promise<void> => {
  const { url, dbEnvName, retries = 2, delay = 1500 } = options;

  const mongoUrl = url || buildUrl(dbEnvName);

  if (!mongoUrl) {
    logger.error(
      'Missing Mongo URL env var (MONGODB_URI or MONGOURL) or dbEnvName'
    );
    return;
  }

  if (_connecting) {
    logger.info('waiting for in-progress MongoDB connection...');
    try {
      await _connecting;
    } catch (e) {
      logger.error('error connecting to MongoDB:', e);
    }
    if (mongoose.connection.readyState !== 0) {
      if (_connectedUrl && _connectedUrl !== mongoUrl) {
        logger.warn(
          'Existing mongoose connection uses a different URL than requested. Connection not re-established.'
        );
      }
      return;
    }
  }

  if (mongoose.connection.readyState !== 0) {
    if (_connectedUrl && _connectedUrl !== mongoUrl) {
      logger.warn(
        'reusing existing mongoose connection to a different URL; requested:',
        mongoUrl
      );
    } else {
      logger.info(
        'reusing existing mongoose connection (state):',
        mongoose.connection.readyState
      );
    }
    return;
  }

  logger.info('attempting to connect to MongoDB:', mongoUrl);

  try {
    _connecting = mongoose.connect(mongoUrl, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    await _connecting;
    _connectedUrl = mongoUrl;
    logger.info('connected to MongoDB');
    _connecting = null;
  } catch (err) {
    _connecting = null;
    const message = err instanceof Error ? err.message : err;
    logger.error('error connecting to MongoDB:', message);
    if (retries > 0) {
      logger.info(`retrying in ${delay}ms (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delay));
      return startConnection({
        url: mongoUrl,
        retries: retries - 1,
        delay: delay * 2
      });
    }
    throw err;
  }
};

const closeConnection = async (): Promise<void> => {
  await mongoose.connection.close();
};

export { startConnection, buildUrl, PORT, DEFAULT_DB_ENV_KEY, closeConnection };
