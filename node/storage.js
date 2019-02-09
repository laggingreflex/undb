const fs = require('fs');

exports.read = read;
exports.write = write;

function read(opts = {}) {
  const initial = Object.assign({}, opts.initial);

  if (!opts.path) {
    return initial;
  }

  let str;
  try {
    str = (fs.readFileSync(opts.path, 'utf8')) || '{}';
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
  fs.writeFileSync(opts.path, JSON.stringify(db, null, 2));
  return db;
}
