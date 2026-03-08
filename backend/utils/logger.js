const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.info(...params);
};
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.error(...params);
};
const warn = (...params) => {
  if (process.env.NODE_ENV !== 'test') console.warn(...params);
};
module.exports = { info, error, warn };
