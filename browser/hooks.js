const React = require('react');
const undb = require('.');

module.exports = { useState, createUseState };

function useState(opts = {}) {
  const [initial, update] = React.useState(opts.initial);
  const [state, onChange] = undb({ ...opts, initial });
  onChange(() => update(JSON.parse(JSON.stringify(state))));
  return state;

  // /* Using `useRef` for it to not use `undb({ initial })` */
  // /* But this doesn't seem to be working right, has weird update issues... */
  // const [state, onChange] = useRef(undb(opts)).current;
  // const [, update] = useState();
  // onChange(() => update(state))
  // return state;
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
