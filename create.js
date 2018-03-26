const onChange = require('on-change');
const debounce = require('debounce');
const ority = require('ority');

module.exports = storage => (...args) => {

  let opts = ority(args, [{
    opts: 'object',
  }, {
    initial: 'object',
    onChange: 'function',
  }, {
    opts: 'object',
    onChange: 'function',
  }, {
    onChange: 'function',
  }]);

  if (opts.opts) {
    opts = Object.assign(opts, opts.opts);
  }

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
