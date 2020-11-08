const React = require('react');
const undb = require('.');

module.exports = { useState, createUseState };

function useState(opts = {}) {
  const [initial, update] = React.useState(opts.initial);
  const ref = React.useRef();
  if (!ref.current) {
    const [state, onChange] = undb({ ...opts, initial });
    ref.current = { state, onChange };
  }
  const { state, onChange } = ref.current
  onChange(() => update(JSON.parse(JSON.stringify(state))));
  return state;
};

function createUseState(onChange, opts = {}) {
  const updates = new Set;
  onChange(() => {
    for (const update of updates) {
      update(Math.random());
    }
  });
  return () => {
    const [, update] = React.useState();
    React.useEffect(() => {
      updates.add(update);
      return () => updates.delete(update);
    });
  }
}
