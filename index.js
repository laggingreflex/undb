/** https://github.com/visionmedia/debug/blob/master/src/index.js */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = require('./browser');
} else {
  module.exports = require('./node');
}
