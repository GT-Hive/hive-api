'use strict';

const db = require('../../models');

exports.getCommunities = (req, res) => {
  db.sequelize
    .query(`
      SELECT C.id, name
      FROM Interest
      JOIN (SELECT id, interest_id FROM Community) C
      ON C.interest_id = Interest.id;
    `,
      { type: db.sequelize.QueryTypes.SELECT }
    )
    .then(communities => {
      communities
        ? res.json({ communities })
        : res.status(404).json({ error: 'Communities are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get communities' }));
};

exports.getCommunity = (req, res) => {
  const { id } = req.params;

  db.sequelize
    .query(`
      SELECT C.id, name
      FROM Interest
      JOIN (SELECT id, interest_id FROM Community) C
      ON C.interest_id = Interest.id
      WHERE C.id = $id;
    `,
      { bind: { id }, type: db.sequelize.QueryTypes.SELECT }
    )
    .then(community => {
      community[0]
        ? res.json({ community: community[0] })
        : res.status(404).json({ error: 'Community is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the community' }));
};

exports.addCommunityByInterest = (req, res) => {
  const {
    community: { interest_id },
  } = req.body;

  db.Interest
    .findOne({ where: { id: interest_id } })
    .then(interest => {
      if (!interest) return res.status(404).json({ error: 'Interest not found for community' });

      Community
        .create({ interest_id })
        .then(() => res.json({ success: 'Successfully added the community' }))
        .catch(err => res.json({ error: 'The community already exists' }));
    })
    .catch(err => res.status(404).json({ error: 'Interest not found for community' }));
};

exports.removeCommunity = (req, res) => {
  const { id } = req.params;

  db.Community
    .destroy({ where: { id } })
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
    .destroy({ where: { interest_id: id } })
    .then(removedCommunity => {
      removedCommunity
        ? res.json({ success: 'Successfully removed the community' })
        : res.status(404).json({ error: 'Community is not found' });
    })
    .catch(err => res.json({ error: 'Failed to remove the community due to an error' }));
};
