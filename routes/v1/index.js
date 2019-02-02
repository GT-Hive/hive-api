'use strict';

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

  /*
  *************************************************************
  * Require JWT authentication by default for below endpoints *
  *************************************************************
  */
  router.use(jwtAuth.required);

  // user
  router.get('/users', users.getUsers);
  router.get('/users/:id', users.getUser);
  router.delete('/users/:id', userHelper.requireCurrentUser, users.removeUser);
  router.patch('/users/:id', userHelper.requireCurrentUser, users.updateUser);

  // user skills
  router.get('/users/:id/skills', users.getUserSkills);
  router.post('/users/:id/skills/:skill_id', userHelper.requireCurrentUser, users.addUserSkill);
  router.delete('/users/:id/skills/:skill_id', userHelper.requireCurrentUser, users.removeUserSkill);

  // user interest
  router.get('/users/:id/interests', users.getUserInterests);
  router.post('/users/:id/interests/:interest_id', userHelper.requireCurrentUser, users.addUserInterest);
  router.delete('/users/:id/interests/:interest_id', userHelper.requireCurrentUser, users.removeUserInterest);

  // user communities
  router.get('/users/:id/communities', users.getUserCommunities);
  router.post('/users/:id/communities/:community_id', userHelper.requireCurrentUser, users.addUserCommunity);
  router.delete('/users/:id/communities/:community_id', userHelper.requireCurrentUser, users.removeUserCommunity);

  // interests
  router.get('/interests', interests.getInterests);
  router.get('/interests/:id', interests.getInterest);
  router.post('/interests', interests.createInterest);
  router.delete('/interests/:id', interests.removeInterest);
  router.patch('/interests/:id', interests.updateInterest);

  // skills
  router.get('/skills', skills.getSkills);
  router.get('/skills/:id', skills.getSkill);
  router.post('/skills', skills.createSkill);
  router.delete('/skills/:id', skills.removeSkill);
  router.patch('/skills/:id', skills.updateSkill);

  // communities
  router.get('/communities', communities.getCommunities);
  router.get('/communities/:id', communities.getCommunity);
  router.post('/communities', communities.addCommunityByInterest);
  router.delete('/communities/:id', communities.removeCommunity);
  router.delete('/communities/interests/:id', communities.removeCommunityByInterest);

  app.use('/api/v1', router);
};
