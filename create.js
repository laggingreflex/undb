const onChange = require('on-change');
const debounce = require('debounce');

module.exports = storage => (opts) => {

  if (typeof opts === 'function') {
    opts = { onChange: opts }
  }

  if (!opts.onChange) throw new Error('Need an onChange function');

  if (!opts.initial) {
    opts.initial = {};
  }

  if (!('delay' in opts)) {
    opts.delay = 1000;
  }

  opts.read = opts.read || storage.read;
  opts.write = opts.write || storage.write;

  let db = opts.read(opts, storage.read);
  let watched;

  let save = change => {
    if (opts.onChange) { opts.onChange(watched) }
    opts.write(db, opts, storage.write);
  }
  if (opts.debounce) {
    save = debounce(save, opts.debounce, false);
  }

  watched = onChange(db, save);

  if (opts.onChange) { opts.onChange(watched) }
}
