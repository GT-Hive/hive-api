'use strict';

const db = require('../../../models');
const interestParams = require('../../../lib/interestHelper').attributes;

exports.getUserInterests = (req, res) => {
  const { id } = req.params;

  db.Interest
    .findAll({
      attributes: interestParams,
      include: {
        association: 'users',
        where: { id },
        attributes: [],
      },
    })
    .then(interests => {
      interests
        ? res.json({ interests })
        : res.status(404).json({ error: 'Interest is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get user interests' }));
};

exports.addUserInterest = (req, res) => {
  const { interest_id } = req.params;
  const { user } = res.locals;

  db.Interest
    .findOne({
      where: {
        id: interest_id,
      },
    })
    .then(interest => {
      if (!interest) return res.status(404).json({ error: 'Interest is not found' });

      user
        .addInterest(interest)
        .then(() => res.json({ success: 'Successfully added the interest' }))
        .catch(err => res.status(403).json({ error: 'Cannot add the interest' }));
    })
    .catch(err => res.status(404).json({ error: 'Interest is not found' }));
};

exports.removeUserInterest = (req, res) => {
  const { id, interest_id } = req.params;

  db.User_Interest
    .destroy({
      where: {
        user_id: id,
        interest_id,
      },
    })
    .then(removedInterest => {
      removedInterest
        ? res.json({ success: 'Successfully removed the interest from the user' })
        : res.status(404).json({ error: 'Interest is not found from the user' });
    })
    .catch(err => res.json({ error: 'Failed to remove the interest from the user' }));
};
