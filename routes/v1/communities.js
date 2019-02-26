'use strict';

const db = require('../../models');
const communityParams = require('../../lib/communitiesHelper').attributes;
const eventParams = require('../../lib/eventHelper').attributes;
const userParams = require('../../lib/userHelper').attributes;

exports.getCommunities = (req, res) => {
  db.Community
    .findAll({
      attributes: communityParams,
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
        where: { id },
        association: 'communities',
        attributes: communityParams,
        through: {
          attributes: [],
        },
      },
    })
    .then(users => {
      users
        ? res.json({ users })
        : res.status(404).json({ error: 'Users of the community are not found' });
    });
};

exports.createCommunity = (req, res) => {
  const {
    community: {
      name,
      content,
      img_url,
    }
  } = req.body;

  db.Community
    .create({
      name,
      content,
      img_url,
    })
    .then(() => res.json({ success: 'Successfully created the community' }))
    .catch(err => res.json({ error: 'Failed to create a community' }));
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

exports.updateCommunity = (req, res) => {
  const { id } = req.params;
  const {
    community: {
      name,
      content,
      img_url,
    }
  } = req.body;

  db.Community
    .update(
      {
        name,
        content,
        img_url,
      },
      {
        where: { id },
      },
    )
    .then(result => {
      result[0] > 0
        ? res.json({ success: 'Successfully updated the community' })
        : res.status(403).json({
          error: 'Already updated or failed to update due to an invalid community',
        });
    })
    .catch(err => res.status(403).json({ error: 'Failed to update the community' }));
};

exports.getCommunityEvents = (req, res) => {
  const { id } = req.params;

  db.Event
    .findAll({
      attributes: eventParams,
      include: [
        {
          where: { id },
          association: 'community',
          attributes: communityParams,
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
