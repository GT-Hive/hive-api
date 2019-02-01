'use strict';

const db = require('../../models');
const userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];
const interestParams = ['id', 'name'];

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

exports.getUserSkills = (req, res) => {
  const { id } = req.params;

  db.User
    .findAll({ where: { id }, include: ['Skill'] })
    .then(user => {
      user[0]
        ? res.json(user[0]['Skill'])
        : res.status(404).json({ error: 'User is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get user skills' }));
};

exports.addUserSkill = (req, res) => {
  const { skill_id } = req.params;
  const { user } = res.locals;

  db.Skill
    .findOne({ where: { id: skill_id } })
    .then(skill => {
      if (!skill) return res.status(404).json({ error: 'Skill is not found' });

      user
        .addSkill(skill)
        .then(() => res.json({ success: 'Successfully added the skill' }))
        .catch(err => res.status(403).json({ error: 'Cannot add the skill' }));
    })
    .catch(err => res.status(404).json({ error: 'Skill is not found' }));
};

exports.removeUserSkill = (req, res) => {
  const { id, skill_id } = req.params;

  db.User_Skill
    .destroy({ where: { user_id: id, skill_id } })
    .then(removedSkill => {
      removedSkill
        ? res.json({ success: 'Successfully removed the skill from the user' })
        : res.status(404).json({ error: 'Skill is not found from the user' });
    })
    .catch(err => res.json({ error: 'Failed to remove the skill from the user' }));
};

exports.getUserInterests = (req, res) => {
  const { id } = req.params;

  db.Interest
    .findAll({
      attributes: interestParams,
      include: [{
        association: 'User',
        where: { id },
        attributes: []
      }],
    })
    .then(interests => {
      interests
        ? res.json(interests)
        : res.status(404).json({ error: 'Interest is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get user interests' }));
};

exports.addUserInterest = (req, res) => {
  const { interest_id } = req.params;
  const { user } = res.locals;

  db.Interest
    .findOne({ where: { id: interest_id } })
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
    .destroy({ where: { user_id: id, interest_id } })
    .then(removedInterest => {
      removedInterest
        ? res.json({ success: 'Successfully removed the interest from the user' })
        : res.status(404).json({ error: 'Interest is not found from the user' });
    })
    .catch(err => res.json({ error: 'Failed to remove the interest from the user' }));
};
