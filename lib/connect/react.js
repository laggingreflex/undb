const lib = require('react');
const connect = require('.');

module.exports = (onChange, libOpts) => connect(onChange, { ...lib, ...libOpts });
