require('proxy-observe');
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
  opts.write = opts.write || storage.write;

  let db = opts.read(opts);
  let deepObserve;

  let save = change => {
    if (opts.onChange) { opts.onChange(deepObserve) }
    opts.write(db, opts);
  }
  if (opts.debounce) {
    save = debounce(save, opts.debounce, false);
  }

  return deepObserve = Object.deepObserve(db, save);
}
