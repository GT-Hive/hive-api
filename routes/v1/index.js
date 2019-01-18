const auth = require('./auth');
const users = require('./users');

module.exports = (app, router) => {
  // auth endpoints
  router.get('/auth/login', auth.login);
  router.get('/auth/register', auth.register);

  // user endpoints
  router.get('/users', users.getUsers);
  router.get('/users/:id', users.getUser);

  app.use('/api/v1', router);
}
