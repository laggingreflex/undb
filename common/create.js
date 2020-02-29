const _ = require('./utils');

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

  let save = (...args) => {
    if (listeners.size) {
      // listeners.forEach(onChange => onChange(watched, onChange.length > 1 && JSON.parse(JSON.stringify(watched))));
      listeners.forEach(onChange => onChange(...args));
    } else {
      if (!opts.silent) console.warn('[undb] State change occurred but no onChange listeners were found');
    }
    return write() || watched;
  }
  if (opts.debounce) {
    save = _.debounce(opts.debounce, save);
  } else if (opts.throttle) {
    save = _.throttle(opts.throttle, save);
  }
  if (!opts.before) {
    save = (save => (...args) => setTimeout(save, 0, ...args))(save);
  }

  let addListener;
  [watched, addListener] = _.onChange(read());
  addListener(save);

  function link(...rest) {
    return _.link([watched, onChange], ...rest);
  }

  function onChange(onChange) {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  }

  return [watched, onChange, link];
};
