const localforage = require('localforage');
const debug = require('debug')('undb:storage:browser');

exports.read = opts => {
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  debug('Reading from localforage', opts.path)
  return localforage.getItem(opts.path).catch((error) => {
    console.warn(`WARN: Couldn't read database from from localforage; using opts.initial. (${error.message})`);
    const db = opts.initial;
    const write = (opts.write || exports.write)(db, opts);
    if (write && write.then) {
      return write.then(() => db);
    } else {
      return db;
    }
  });
}

exports.write = (db, opts) => {
  if (!db) {
    throw new Error('Need a db');
  }
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  debug('Storing to localforage', opts.path)
  return localforage.setItem(opts.path, db).then(() => db).catch(error => {
    error.message = `Couldn't store to localforage. (${error.message})`;
    throw error;
  });
}
