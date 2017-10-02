const fs = require('mz/fs');
const debug = require('debug')('undb:storage:node');

exports.read = read;
exports.write = write;

let fd;

async function read(opts) {
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  let str;
  try {
    str = (await fs.readFile(opts.path, 'utf8')) || '{}';
  } catch (error) {
    str = '{}';
  }
  let db = JSON.parse(str);
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
  debug('Writing file', opts.path)
  fd = fd || await fs.open(opts.path, 'w+');
  await fs.writeFile(fd, JSON.stringify(db, null, 2));
  return db;
}
