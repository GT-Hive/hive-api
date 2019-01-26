const jwtAuth = require('../../config/jwtAuth');
const auth = require('./auth');
const users = require('./users');
const interests = require('./interests');

module.exports = (app, router) => {
  // auth
  router.post('/auth/login', jwtAuth.optional, auth.login);
  router.post('/auth/register', jwtAuth.optional, auth.register);
  router.get('/auth/request-confirm-email/:token', jwtAuth.optional, auth.requestConfirmEmail);
  router.get('/auth/confirm-email/:token', jwtAuth.optional, auth.confirmToken);

  // user
  router.get('/users', jwtAuth.required, users.getUsers);
  router.get('/users/:id', jwtAuth.required, users.getUser);
  
  // interests
  router.get('/interests', jwtAuth.required, interests.getInterests);
  router.get('/interests/:id', jwtAuth.required, interests.getInterest);
  router.post('/interests', jwtAuth.required, interests.createInterest);
  router.delete('/interests/:id', jwtAuth.required, interests.removeInterest);
  router.patch('/interests/:id', jwtAuth.required, interests.updateInterest);

  app.use('/api/v1', router);
};
