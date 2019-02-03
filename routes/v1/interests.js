'use strict';

const Interest = require('../../models').Interest;
const interestParams = ['id', 'name'];

exports.getInterests = (req, res) => {
  Interest
    .findAll({
      attributes: interestParams,
    })
    .then(interests => res.json({ interests }));
};

exports.getInterest = (req, res) => {
  const { id } = req.params;

  Interest
    .findOne({
      where: { id },
      attributes: interestParams,
    })
    .then(interest => res.json({ interest }));
};

exports.createInterest = (req, res) => {
  const { interest } = req.body;

  Interest
    .create({
      name: interest.name,
    })
    .then(() => res.json({ success: 'Successfully created the interest' }))
    .catch(err => res.json({ error: 'Failed to create the interest due to an error' }));
};

exports.removeInterest = (req, res) => {
  const { id } = req.params;

  Interest
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
  const { interest } = req.body;

  Interest
    .update(
      {
        name: interest.name,
      },
      {
        where: { id },
      },
    )
    .then(result => {
      result[0] > 0
        ? res.json({ success: 'Successfully updated the interest' })
        : res.status(403).json({
          error: 'Already updated or failed to update due to invalid interest',
        });
    })
    .catch(err => res.status(403).json({ error: 'Failed to update the interest' }));
};
