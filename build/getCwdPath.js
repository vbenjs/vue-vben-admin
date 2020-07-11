const { join } = require('path');

module.exports = function (dir) {
  return join(process.cwd(), dir);
};
