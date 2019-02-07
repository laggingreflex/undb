const lib = require('preact');
const connect = require('.');

module.exports = (onChange, libOpts) => connect(onChange, { ...lib, ...libOpts });
