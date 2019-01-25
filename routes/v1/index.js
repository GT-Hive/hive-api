const jwtAuth = require('../../config/jwtAuth');
const auth = require('./auth');
const users = require('./users');

module.exports = (app, router) => {
  // auth
  router.post('/auth/login', jwtAuth.optional, auth.login);
  router.post('/auth/register', jwtAuth.optional, auth.register);
  router.get('/auth/request-confirm-email/:token', jwtAuth.optional, auth.requestConfirmEmail);
  router.get('/auth/confirm-email/:token', jwtAuth.optional, auth.confirmToken);

  // user
  router.get('/users', jwtAuth.required, users.getUsers);
  router.get('/users/:id', jwtAuth.required, users.getUser);

  app.use('/api/v1', router);
};
