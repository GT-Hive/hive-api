'use strict';

const jwtAuth = require('../../config/jwtAuth');
const userHelper = require('../../lib/userHelper');
const auth = require('./auth');
const users = require('./users');
const userCommunities = require('./users/communities');
const userInterests = require('./users/interests');
const userSkills = require('./users/skills');
const userEvents = require('./users/events');
const interests = require('./interests');
const skills = require('./skills');
const communities = require('./communities');
const events = require('./events');

module.exports = (app, router) => {
  // auth
  router.post('/auth/login', jwtAuth.optional, auth.login);
  router.post('/auth/register', jwtAuth.optional, auth.register);
  router.post('/auth/request-confirm-email/:token', jwtAuth.optional, auth.requestConfirmEmail);
  router.get('/auth/confirm-email/:token', jwtAuth.optional, auth.confirmToken);
  router.patch('/auth/reset-password', jwtAuth.optional, auth.resetPassword);

  // communities
  router.get('/communities', jwtAuth.optional, communities.getCommunities);

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
  router.patch('/users/:id/password', userHelper.requireCurrentUser, users.updateUserPassword);

  // user skills
  router.get('/users/:id/skills', userSkills.getUserSkills);
  router.post('/users/:id/skills/:skill_id', userHelper.requireCurrentUser, userSkills.addUserSkill);
  router.delete('/users/:id/skills/:skill_id', userHelper.requireCurrentUser, userSkills.removeUserSkill);

  // user interest
  router.get('/users/:id/interests', userInterests.getUserInterests);
  router.post('/users/:id/interests/:interest_id', userHelper.requireCurrentUser, userInterests.addUserInterest);
  router.delete('/users/:id/interests/:interest_id', userHelper.requireCurrentUser, userInterests.removeUserInterest);

  // user communities
  router.get('/users/:id/communities', userCommunities.getUserCommunities);
  router.post('/users/:id/communities/:community_id', userHelper.requireCurrentUser, userCommunities.addUserCommunity);
  router.delete('/users/:id/communities/:community_id', userHelper.requireCurrentUser, userCommunities.removeUserCommunity);

  // user events
  router.get('/users/:id/events', userEvents.getUserEvents);
  router.get('/users/:id/guest-events', userEvents.getUserGuestEvents);
  router.get('/users/:id/host-events', userEvents.getUserHostEvents);
  router.post('/users/:id/host-events', userHelper.requireCurrentUser, userEvents.createHostEvent);
  router.delete('/users/:id/host-events/:event_id', userHelper.requireCurrentUser, userEvents.removeHostEvent);
  router.post('/users/:id/guest-events/:event_id', userHelper.requireCurrentUser, userEvents.addGuestEvent);
  router.delete('/users/:id/guest-events/:event_id', userHelper.requireCurrentUser, userEvents.removeGuestEvent);
  router.patch('/users/:id/host-events/:event_id', userHelper.requireCurrentUser, userEvents.updateHostEvent);

  // events
  router.get('/events', events.getEvents);
  router.get('/events/:id', events.getEvent);
  router.get('/events/:id/guests', events.getEventGuests);
  router.get('/events/:id/hosts', events.getEventHosts);

  // interests
  router.get('/interests', interests.getInterests);
  router.get('/interests/:id', interests.getInterest);
  router.get('/interests/:id/users', interests.getInterestUsers);
  router.post('/interests', interests.createInterest);
  router.delete('/interests/:id', interests.removeInterest);
  router.patch('/interests/:id', interests.updateInterest);

  // skills
  router.get('/skills', skills.getSkills);
  router.get('/skills/:id', skills.getSkill);
  router.post('/skills', skills.createSkill);
  router.delete('/skills/:id', skills.removeSkill);
  router.patch('/skills/:id', skills.updateSkill);
  router.get('/skills/:id/users', skills.getSkillUsers);

  // communities
  router.get('/communities/:id', communities.getCommunity);
  router.get('/communities/:id/users', communities.getCommunityUsers);
  router.get('/communities/:id/events', communities.getCommunityEvents);
  router.post('/communities', communities.createCommunity);
  router.delete('/communities/:id', communities.removeCommunity);
  router.patch('/communities/:id', communities.updateCommunity);

  app.use('/api/v1', router);
};
