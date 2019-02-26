'use strict';

const db = require('../../models');
const interestParams = require('../../lib/interestHelper').attributes;
const userParams = require('../../lib/userHelper').attributes;

exports.getInterests = (req, res) => {
  db.Interest
    .findAll({
      attributes: interestParams,
    })
    .then(interests => {
      interests
        ? res.json({ interests })
        : res.status(404).json({ error: 'Interests are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get interests' }));
};

exports.getInterest = (req, res) => {
  const { id } = req.params;

  db.Interest
    .findOne({
      where: { id },
      attributes: interestParams,
    })
    .then(interest => {
      interest
        ? res.json({ interest })
        : res.status(404).json({ error: 'Interest is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get interest' }));
};

exports.getInterestUsers = (req, res) => {
  const { id } = req.params;

  db.User
    .findAll({
      attributes: userParams,
      include: {
        association: 'interests',
        attributes: interestParams,
        where: { id },
        through: {
          attributes: [],
        },
      },
    })
    .then(users => {
      users
        ? res.json({ users })
        : res.status(404).json({ error: 'Users of the interest are not found' });
    });
};

exports.createInterest = (req, res) => {
  const {
    interest: {
      name,
    },
  } = req.body;

  db.Interest
    .create({
      name,
    })
    .then(() => res.json({ success: 'Successfully created the interest' }))
    .catch(err => res.json({ error: 'Failed to create an interest' }));
};

exports.removeInterest = (req, res) => {
  const { id } = req.params;

  db.Interest
    .destroy({
      where: { id },
    })
    .then(removedInterest => {
      removedInterest
        ? res.json({ success: 'Successfully removed the interest' })
        : res.status(404).json({ error: 'Interest is not found' });
    })
    .catch(err => res.json({ error: 'Failed to remove the interest due to an error' }));
};

exports.updateInterest = (req, res) => {
  const { id } = req.params;
  const {
    interest: {
      name,
    }
  } = req.body;

  db.Interest
    .update(
      {
        name,
      },
      {
        where: { id },
      },
    )
    .then(result => {
      result[0] > 0
        ? res.json({ success: 'Successfully updated the interest' })
        : res.status(403).json({
          error: 'Already updated or failed to update due to an invalid interest',
        });
    })
    .catch(err => res.status(403).json({ error: 'Failed to update the interest' }));
};
