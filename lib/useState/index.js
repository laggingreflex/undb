const undb = require('../browser');

module.exports = ({ useState, useRef }) => (opts = {}) => {
  const [initial, update] = useState(opts.initial);
  const [state, onChange] = undb({ ...opts, initial });
  onChange(() => update(state));
  return state;

  // /* Using `useRef` for it to not use `undb({ initial })` */
  // /* But this doesn't seem to be working right, has weird update issues... */
  // const [state, onChange] = useRef(undb(opts)).current;
  // const [, update] = useState();
  // onChange(() => update(state))
  // return state;
}
