const onChange = require('on-change');
const debounce = require('debounce');

module.exports = storage => (opts) => {

  const listeners = new Set;

  if (typeof opts === 'function') {
    opts = { onChange: opts }
  }

  if (!opts) opts = {};

  if (opts.onChange) {
    listeners.add(opts.onChange);
  }

  if (!opts.initial) {
    opts.initial = {};
  }

  const modifyOpts = Object.assign.bind(Object, {}, opts);

  let watched;

  const read = () => {
    if (opts.read === false) return opts.initial;
    return (opts.read || (read => read()))(opts => storage.read(modifyOpts(opts)));
  };
  const write = () => {
    if (opts.write === false) return watched;
    return (opts.write || (write => write()))((modified, opts) => storage.write(modified || watched, modifyOpts(opts)));
  };

  let save = () => {
    if (listeners.size) {
      listeners.forEach(onChange => onChange(watched));
    } else {
      if (!opts.silent) console.warn('[undb] State change occurred but no onChange listeners were found');
    }
    return write() || watched;
  }
  if (opts.debounce) {
    save = debounce(save, opts.debounce, false);
  }
  if (!opts.before) {
    save = setTimeout.bind(null, save);
  }

  watched = onChange(read(), save);

  return [watched, onChange => {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  }];
};
