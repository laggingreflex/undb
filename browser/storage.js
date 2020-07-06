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

  if (opts.clear) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === opts.path) continue;
      localStorage.removeItem(key);
    }
  }

  return (opts.write || write)(db, opts, write);
  // return (opts.write || write)(db, opts, (_db = db, _opts = opts) => write(_db, _opts));
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
