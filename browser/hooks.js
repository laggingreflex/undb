const { useState, useEffect } = require('react');
const undb = require('.');

exports.useState = (opts = {}) => {
  const [initial, update] = useState(opts.initial);
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

exports.createUseState = (onChange, opts = {}) => {
  const updates = new Set;
  onChange(() => {
    for (const update of updates) {
      update(Math.random());
    }
  });
  return () => {
    const [, update] = useState();
    useEffect(() => {
      updates.add(update);
      return () => updates.delete(update);
    });
  }
}
