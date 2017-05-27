const fs = require('fs');
const debug = require('debug')('undb:storage:node');

const read = exports.read = opts => {
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  let str, json;
  try {
    debug('Reading file', opts.path)
    str = fs.readFileSync(opts.path, 'utf8');
  } catch (error) {
    console.warn(`WARN: Couldn't read database from file; using opts.initial. (${error.message})`);
    const db = opts.initial;
    opts.write(db, opts);
    return db;
  }
  try {
    debug('Parsing file', opts.path)
    json = JSON.parse(str);
    return json;
  } catch (error) {
    error.message = `Couldn't parse database from file. (${error.message})`;
    throw error;
  }
}


const write = exports.write = (db, opts) => {
  if (!db) {
    throw new Error('Need a db');
  }
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  debug('Writing file', opts.path)
  try {
    fs.writeFileSync(opts.path, JSON.stringify(db));
  } catch (error) {
    error.message = `Couldn't write database to file. (${error.message})`;
    throw error;
  }
}
