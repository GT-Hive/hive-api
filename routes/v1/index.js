const jwtAuth = require('../../config/jwtAuth');
const userHelper = require('../../lib/userHelper');
const auth = require('./auth');
const users = require('./users');
const interests = require('./interests');
const skills = require('./skills');
const communities = require('./communities');

module.exports = (app, router) => {
  // auth
  router.post('/auth/login', jwtAuth.optional, auth.login);
  router.post('/auth/register', jwtAuth.optional, auth.register);
  router.get('/auth/request-confirm-email/:token', jwtAuth.optional, auth.requestConfirmEmail);
  router.get('/auth/confirm-email/:token', jwtAuth.optional, auth.confirmToken);

  // user
  router.get('/users', jwtAuth.required, users.getUsers);
  router.get('/users/:id', jwtAuth.required, users.getUser);
  router.delete('/users/:id', [userHelper.requireCurrentUser, jwtAuth.required], users.removeUser);
  router.patch('/users/:id', [userHelper.requireCurrentUser, jwtAuth.required], users.updateUser);

  // user skills
  router.get('/users/:id/skills', jwtAuth.required, users.getUserSkills);
  router.post('/users/:id/skills/:skill_id', [userHelper.requireCurrentUser, jwtAuth.required], users.addUserSkill);
  router.delete('/users/:id/skills/:skill_id', [userHelper.requireCurrentUser, jwtAuth.required], users.removeUserSkill);

  // user interest
  router.get('/users/:id/interests', jwtAuth.required, users.getUserInterests);
  router.post('/users/:id/interests/:interest_id', [userHelper.requireCurrentUser, jwtAuth.required], users.addUserInterest);
  router.delete('/users/:id/interests/:interest_id', [userHelper.requireCurrentUser, jwtAuth.required], users.removeUserInterest);

  // interests
  router.get('/interests', jwtAuth.required, interests.getInterests);
  router.get('/interests/:id', jwtAuth.required, interests.getInterest);
  router.post('/interests', jwtAuth.required, interests.createInterest);
  router.delete('/interests/:id', jwtAuth.required, interests.removeInterest);
  router.patch('/interests/:id', jwtAuth.required, interests.updateInterest);

  // skills
  router.get('/skills', jwtAuth.required, skills.getSkills);
  router.get('/skills/:id', jwtAuth.required, skills.getSkill);
  router.post('/skills', jwtAuth.required, skills.createSkill);
  router.delete('/skills/:id', jwtAuth.required, skills.removeSkill);
  router.patch('/skills/:id', jwtAuth.required, skills.updateSkill);
  
  // communities
  router.get('/communities', jwtAuth.required, communities.getCommunities);
  router.get('/communities/:id', jwtAuth.required, communities.getCommunity);
  router.post('/communities', jwtAuth.required, communities.addCommunityByInterest);
  router.delete('/communities/:id', jwtAuth.required, communities.removeCommunity);
  router.delete('/communities/interests/:id', jwtAuth.required, communities.removeCommunityByInterest);
  
  app.use('/api/v1', router);
};
