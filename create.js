require('proxy-observe')
const debounce = require('debounce');

module.exports = storage => (initial, opts) => {
  if (!opts) {
    opts = initial;
    initial = {};
  }
  if (!opts || !opts.path) {
    throw new Error('Need at least an opts.path');
  }
  initial = initial || opts.initial || {};
  if (!('delay' in opts)) {
    opts.delay = 1000;
  }

  opts.read = opts.read || storage.read;
  // opts.read = (...args) => opts.read(...args, storage.read);
  opts.write = opts.write || storage.write;
  // opts.write = (...args) => opts.write(...args, storage.write);

  let db = opts.read(opts);

  let save = change => opts.write(db, opts);
  if (opts.delay) {
    save = debounce(save, typeof opts.delay === 'number' ? opts.delay : 1000);
  }

  if (db.then) {
    return db.then(_db => {
      db = _db;
      db = Object.deepObserve(db, save);
      return db;
    });
  } else {
    db = Object.deepObserve(db, save);
    return db;
  }

}
