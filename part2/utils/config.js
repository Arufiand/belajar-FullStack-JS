// Shared MongoDB connector for part2
require('dotenv').config();
const mongoose = require('mongoose');
const { joinUrl } = require('../helper/general_helper');
const logger = require('./logger');

mongoose.set('strictQuery', false);

let _connecting = null;
let _connectedUrl = null;

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGOURL;
const PHONEBOOK_DB = process.env.PHONEBOOK_DB;
const NOTES_DB = process.env.NOTES_DB;

const buildUrl = dbEnvName => {
  // prefer MONGODB_URI if set, then MONGOURL
  const full = process.env.MONGODB_URI || MONGO_URL;

  // If there's no base URL configured
  if (!full) {
    if (!dbEnvName) return null;
    // If caller passed a full connection string directly as dbEnvName, accept it
    if (/^mongodb(\+srv)?:\/\//.test(dbEnvName)) return dbEnvName;
    // If caller passed an env var name whose value is a full connection string, use it
    if (
      process.env[dbEnvName] &&
      /^mongodb(\+srv)?:\/\//.test(process.env[dbEnvName])
    ) {
      return process.env[dbEnvName];
    }
    // Otherwise we can't build a connection string without a base URL
    return null;
  }

  if (!dbEnvName) return full;

  // dbEnvName may be either an env var key (e.g. 'PHONEBOOK_DB') or the actual DB name
  const dbCandidate =
    process.env[dbEnvName] !== undefined ? process.env[dbEnvName] : dbEnvName;
  return joinUrl(full, dbCandidate);
};

const connectIfNeeded = async (options = {}) => {
  const { url, dbEnvName, retries = 2, delay = 1500 } = options || {};

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
    logger.error(
      'error connecting to MongoDB:',
      err && err.message ? err.message : err
    );
    if (retries > 0) {
      logger.info(`retrying in ${delay}ms (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delay));
      return connectIfNeeded({
        url: mongoUrl,
        retries: retries - 1,
        delay: delay * 2
      });
    }
    throw err;
  }
};

module.exports = {
  connectIfNeeded,
  buildUrl,
  PORT,
  PHONEBOOK_DB,
  NOTES_DB
};
