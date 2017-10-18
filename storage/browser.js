exports.read = read;
exports.write = write;

function read(opts = {}) {

  const initial = Object.assign({}, opts.initial);

  if (!opts.path) {
    return initial;
  }

  let db;
  try {
    db = JSON.parse(localStorage.getItem(opts.path) || '{}');
  } catch (error) {
    console.warn(`WARN: Couldn't read database from localforage. (${error.message})`);
  }
  if (!db) {
    console.warn('WARN: Initial database from localforage was null. Using `opts.initial || {}`');
    db = opts.initial || {};
  }
  db = Object.assign({}, opts.initial, db);
  return (opts.write || write)(db, opts);
}

function write(db, opts = {}) {
  if (!db) {
    throw new Error('Need a db');
  }
  if (!opts.path) {
    return;
  }
  localStorage.setItem(opts.path, JSON.stringify(db));
  return db;
}
