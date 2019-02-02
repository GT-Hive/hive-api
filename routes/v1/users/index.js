'use strict';

const db = require('../../../models');
const userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];

exports.getUsers = (req, res) => {
  db.User
    .findAll({ attributes: userParams })
    .then(users => res.json({ users }));
};

exports.getUser = (req, res) => {
  const { id } = req.params;

  db.User
    .findOne({ where: { id }, attributes: userParams })
    .then(user => res.json({ user }));
};

exports.removeUser = (req, res) => {
  const { id } = req.params;

  db.User
    .destroy({ where: { id } })
    .then(removedUser => {
      removedUser
        ? res.json({ success: 'Successfully removed the user' })
        : res.status(404).json({ error: 'User is not found' });
      ;
    })
    .catch(err => res.json({ error: 'Failed to remove the user due to an error' }));
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const {
    user: { first_name, last_name, intro, profile_img },
  } = req.body;

  db.User
    .update(
      { first_name, last_name, intro, profile_img },
      { where: { id } }
    )
    .then(result => {
      result[0] > 0
        ? res.json({ success: 'Successfully updated the user' })
        : res.status(403).json({ error: 'Already updated or failed to update due to invalid user' });
    })
    .catch(err => res.status(403).json({ error: 'Failed to update the user' }));
};
