const storage = require('./storage/node');
const create = require('.');

module.exports = create(storage);
