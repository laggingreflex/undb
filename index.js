/**
 * (from debug)
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = require('./browser');
} else {
  module.exports = require('./node');
}
