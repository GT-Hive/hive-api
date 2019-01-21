const jwtAuth = require('../../config/jwt-auth');
const auth = require('./auth');
const users = require('./users');

module.exports = (app, router) => {
  // auth endpoints
  router.post('/auth/login', jwtAuth.optional, auth.login);
  router.post('/auth/register', jwtAuth.optional, auth.register);

  // user endpoints
  router.get('/users', jwtAuth.required, users.getUsers);
  router.get('/users/:id', jwtAuth.required, users.getUser);

  app.use('/api/v1', router);
}
