const fs = require('fs');
const _ = require('./utils');

exports.read = read;
exports.write = write;

function read(opts = {}) {
  const initial = Object.assign({}, opts.initial);

  if (!opts.path) {
    return initial;
  }

  const path = _.normalize(opts.path);

  let str;
  try {
    str = (fs.readFileSync(path, 'utf8')) || '{}';
  } catch (error) {
    str = '{}';
  }
  let db = JSON.parse(str);
  db = Object.assign({}, opts.initial, db);
  return (opts.write || write)(db, opts, write);
}


function write(db, opts = {}) {
  if (!db) {
    throw new Error('Need a db');
  }
  if (!opts.path) {
    return;
  }
  const path = _.normalize(opts.path);
  _.ensureBaseDir(path);
  fs.writeFileSync(path, JSON.stringify(db, null, 2));
  return db;
}
