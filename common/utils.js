const _onChange = require('on-change');
const { throttle, debounce } = require('throttle-debounce');

module.exports = { link, onChange, throttle, debounce };

function link(...inputs) {
  const set = new Set;
  for (const input of inputs) {
    let state, onChange_;
    if (Array.isArray(input)) {
      [state, onChange_] = input
    } else {
      [state, onChange_] = onChange(input);
    }
    set.add(state);
    if (!onChange_) onChange_ = () => {};
    onChange_((path, value) => {
      const keys = Array.isArray(path) ? path : path.split('.');
      const lastKey = keys.pop();
      for (const other of set) {
        if (other === state) continue;
        let last = other;
        for (const key of keys) {
          last = other[key];
        }
        last[lastKey] = value;
      }
    })
  }
}


function onChange(initial) {
  const callbacks = new Set;
  const watched = _onChange(initial, (path, value, previousValue) => {
    for (const cb of callbacks) {
      cb(path, value, previousValue);
    }
  })

  function addListener(cb) {
    callbacks.add(cb);
    return () => {
      callbacks.delete(cb);
    }
  }
  return [watched, addListener];
}
