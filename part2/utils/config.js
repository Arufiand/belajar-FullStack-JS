// Shared MongoDB connector for part2
require('dotenv').config();
const mongoose = require('mongoose');
const { joinUrl } = require('../helper/general_helper');

mongoose.set('strictQuery', false);

let _connecting = null;
let _connectedUrl = null;

const buildUrl = dbEnvName => {
  const full = process.env.MONGODB_URI || process.env.MONGOURL;
  if (!full && !dbEnvName) return null;
  if (!dbEnvName) return full;
  return joinUrl(full, process.env[dbEnvName]);
};

const connectIfNeeded = async (options = {}) => {
  const { url, dbEnvName, retries = 2, delay = 1500 } = options || {};

  const mongoUrl = url || buildUrl(dbEnvName);

  if (!mongoUrl) {
    console.error(
      'Missing Mongo URL env var (MONGODB_URI or MONGOURL) or dbEnvName'
    );
    return;
  }

  if (_connecting) {
    console.log('waiting for in-progress MongoDB connection...');
    try {
      await _connecting;
    } catch (e) {
      console.error('error connecting to MongoDB:', e);
    }
    if (mongoose.connection.readyState !== 0) {
      if (_connectedUrl && _connectedUrl !== mongoUrl) {
        console.warn(
          'Existing mongoose connection uses a different URL than requested. Connection not re-established.'
        );
      }
      return;
    }
  }

  if (mongoose.connection.readyState !== 0) {
    if (_connectedUrl && _connectedUrl !== mongoUrl) {
      console.warn(
        'reusing existing mongoose connection to a different URL; requested:',
        mongoUrl
      );
    } else {
      console.log(
        'reusing existing mongoose connection (state):',
        mongoose.connection.readyState
      );
    }
    return;
  }

  console.log('attempting to connect to MongoDB:', mongoUrl);

  try {
    _connecting = mongoose.connect(mongoUrl, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    await _connecting;
    _connectedUrl = mongoUrl;
    console.log('connected to MongoDB');
    _connecting = null;
  } catch (err) {
    _connecting = null;
    console.error(
      'error connecting to MongoDB:',
      err && err.message ? err.message : err
    );
    if (retries > 0) {
      console.log(`retrying in ${delay}ms (${retries} retries left)`);
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
  buildUrl
};
