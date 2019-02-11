'use strict';

const db = require('../../models');
const communityParams = [
  'id',
  'created_at',
  'updated_at'
];
const eventParams = require('../../lib/eventHelper').attributes;
const userParams = require('../../lib/userHelper').attributes;

exports.getCommunities = (req, res) => {
  db.Community
    .findAll({
      attributes: communityParams,
      include: {
        association: 'interest',
        attributes: ['name'],
      },
    })
    .then(communities => {
      communities
        ? res.json({ communities })
        : res.status(404).json({ error: 'Communities are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get communities' }));
};

exports.getCommunity = (req, res) => {
  const { id } = req.params;

  db.Community
    .findOne({
      where: { id },
      attributes: communityParams,
      include: {
        association: 'interest',
        attributes: ['name'],
      },
    })
    .then(community => {
      community
        ? res.json({ community })
        : res.status(404).json({ error: 'Community is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get community' }));
};

exports.getCommunityUsers = (req, res) => {
  const { id } = req.params;

  db.User
    .findAll({
      attributes: userParams,
      include: {
        association: 'communities',
        attributes: communityParams,
        where: { id },
        include: {
          association: 'interest',
          attributes: ['name'],
        },
        through: {
          attributes: [],
        },
      },
    })
    .then(users => {
      users
        ? res.json({ users })
        : res.status(404).json({ error: 'Community users are not found' });
    })
};

exports.addCommunityByInterest = (req, res) => {
  const {
    community: { interest_id },
  } = req.body;

  db.Interest
    .findOne({
      where: {
        id: interest_id
      },
    })
    .then(interest => {
      if (!interest) return res.status(404).json({ error: 'Interest not found for community' });

      db.Community
        .create({ interest_id })
        .then(() => res.json({ success: 'Successfully added the community' }))
        .catch(err => res.json({ error: 'The community already exists' }));
    })
    .catch(err => res.status(404).json({ error: 'Interest not found for community' }));
};

exports.removeCommunity = (req, res) => {
  const { id } = req.params;

  db.Community
    .destroy({
      where: { id },
    })
    .then(removedCommunity => {
      removedCommunity
        ? res.json({ success: 'Successfully removed the community' })
        : res.status(404).json({ error: 'Community is not found' });
    })
    .catch(err => res.json({ error: 'Failed to remove the community due to an error' }));
};

exports.removeCommunityByInterest = (req, res) => {
  const { id } = req.params;

  db.Community
    .destroy({
      where: {
        interest_id: id,
      },
    })
    .then(removedCommunity => {
      removedCommunity
        ? res.json({ success: 'Successfully removed the community' })
        : res.status(404).json({ error: 'Community is not found' });
    })
    .catch(err => res.json({ error: 'Failed to remove the community due to an error' }));
};

exports.getCommunityEvents = (req, res) => {
  const { id } = req.params;

  db.Event
    .findAll({
      attributes: eventParams,
      include: [
        {
          association: 'community',
          where: { id },
          attributes: communityParams,
          include: {
            association: 'interest',
            attributes: ['name'],
          },
        },
        {
          association: 'location',
          attributes: ['name', 'room_number'],
        },
      ],
    })
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get events' }));
};
