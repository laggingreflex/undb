const Path = require('path');
const OS = require('os');
const fs = require('fs');

const _ = exports;

_.defaults = {
  cwd: process.cwd(),
  homedir: OS.homedir(),
};

_.normalize = (path, {
  cwd = _.defaults.cwd,
  homedir = _.defaults.homedir,
} = {}) => {
  if (Path.isAbsolute(path)) return path;
  if (path.startsWith('~')) return Path.join(homedir, path.substr(1));
  return Path.join(cwd, path);
}

_.ensureBaseDir = path => {
  path = _.normalize(path);
  const baseDir = Path.dirname(path);
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
}
