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
  router.get('/users/:id/guest-events', userEvents.getUserGuestEvents);
  router.get('/users/:id/host-events', userEvents.getUserHostEvents);
  router.get('/users/:id/events', userEvents.getUserEvents);
  router.post('/users/:id/host-events', userHelper.requireCurrentUser, userEvents.createHostEvent);
  router.post('/users/:id/guest-events/:event_id', userHelper.requireCurrentUser, userEvents.addGuestEvent);
  router.delete('/users/:id/host-events/:event_id', userHelper.requireCurrentUser, userEvents.removeHostEvent);
  router.delete('/users/:id/guest-events/:event_id', userHelper.requireCurrentUser, userEvents.removeGuestEvent);
  router.patch('/users/:id/host-events/:event_id', userHelper.requireCurrentUser, userEvents.updateHostEvent);

  // events
  router.get('/events', events.getEvents);
  router.get('/events/:id', events.getEvent);
  router.get('/events/:id/guests', events.getEventGuests);

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
  router.get('/communities/:id/events', communities.getCommunityEvents);

  app.use('/api/v1', router);
};
