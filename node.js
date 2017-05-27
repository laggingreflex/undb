const storage = require('./storage/node');
const create = require('./create');

module.exports = create(storage);
