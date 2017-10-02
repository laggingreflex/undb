const localforage = require('localforage');
const debug = require('debug')('undb:storage:browser');

exports.read = read;
exports.write = write;

async function read(opts) {
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  debug({ opts });
  debug('Reading from localforage', opts.path)
  let db;
  try {
    db = await localforage.getItem(opts.path);
  } catch (error) {
    console.warn(`WARN: Couldn't read database from localforage. (${error.message})`);
    debug({ error });
  }
  debug({ db });
  if (!db) {
    console.warn('WARN: Initial database from localforage was null. Using `opts.initial || {}`');
    db = opts.initial || {};
  }
  db = Object.assign({}, opts.initial, db);
  return (opts.write || write)(db, opts);
}

async function write(db, opts) {
  if (!db) {
    throw new Error('Need a db');
  }
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  debug('Storing to localforage', opts.path)
  await localforage.setItem(opts.path, db);
  return db;
}
