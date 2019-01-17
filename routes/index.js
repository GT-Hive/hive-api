const usersRoutes = require('./users');

module.exports = function(app, db) {
  usersRoutes(app, db);
};
