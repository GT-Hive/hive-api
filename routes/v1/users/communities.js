'use strict';

const db = require('../../../models');
const communitiesParams = require('../../../lib/communitiesHelper').attributes;

exports.getUserCommunities = (req, res) => {
  const { id } = req.params;

  db.Community
    .findAll({
      attributes: communitiesParams,
      include: {
        association: 'users',
        where: { id },
        attributes: [],
      },
    })
    .then(communities => {
      communities
        ? res.json({ communities })
        : res.status(404).json({ error: 'Communities are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get communities' }));
};

exports.addUserCommunity = (req, res) => {
  const { community_id } = req.params;
  const { user } = res.locals;

  db.Community
    .findOne({
      where: {
        id: community_id,
      },
    })
    .then(community => {
      if (!community) return res.status(404).json({ error: 'Community is not found' });

      user
        .addCommunity(community)
        .then(() => res.json({ success: 'Successfully added the community' }))
        .catch(err => res.status(403).json({ error: 'Cannot add the community' }));
    })
    .catch(err => res.status(404).json({ error: 'Community is not found' }));
};

exports.removeUserCommunity = (req, res) => {
  const { id, community_id } = req.params;

  db.User_Community
    .destroy({
      where: {
        community_id,
        user_id: id,
      },
    })
    .then(removedCommunity => {
      removedCommunity
        ? res.json({ success: 'Successfully removed the community from the user' })
        : res.status(404).json({ error: 'Community is not found from the user' });
    })
    .catch(err => res.json({ error: 'Failed to remove the community from the user' }));
};
