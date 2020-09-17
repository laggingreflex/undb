const _ = require('./utils');

/**
 * @typedef undbOpts
 * @property {String} [path] Path used to persist the state
 * @property {Function} [onChange] Function that gets called when state changes
 * @property {Object} [initial] Initial state (overwritten by persisted)
 * @property {Boolean|Function} [read] Whether to, or a custom function to retrieve the persisted state
 * @property {Boolean|Function} [write] Whether to, or a custom function to persist the state
 * @property {Boolean|Number} [debounce] Debounce calling onChange
 * @property {Boolean|Number} [throttle] Throttle calling onChange
 * @property {Boolean} [before] Whether to call the onChange before or after (default) updating the state
 */

module.exports = storage => (/** @type undbOpts */ opts) => {

  const listeners = new Set;

  if (typeof opts === 'function') {
    opts = { onChange: opts }
  }

  if (!opts) opts = {};

  if (typeof opts.onChange === 'function') {
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
  [watched, addListener] = _.onChange(read(), opts.onChange);
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
