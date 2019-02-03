const lib = require('preact');
const connect = require('.');

module.exports = (...args) => connect(...args, lib);
