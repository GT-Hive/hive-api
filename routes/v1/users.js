const db = require('../../models');
const User = db['User'];
const userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];

exports.getUsers = (req, res) => {
  User.findAll({ attributes: userParams }).then((users) => res.json({ users }));
};

exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findOne({ where: { id }, attributes: userParams }).then(user => res.json({ user }));
};

exports.removeUser = (req, res) => {
  const { id } = req.params;

  User.destroy({ where: { id } })
    .then(() => res.json({ success: 'Successfully removed the user' }))
    .catch(err => res.json({ error: 'Failed to remove the user due to an error' }));
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const {
    user: {
      first_name,
      last_name,
      intro,
      profile_img
    }
  } = req.body;

  User.update({ first_name, last_name, intro, profile_img }, { where: { id } })
    .then((result) => {
      if (result[0] > 0) return res.json({ success: 'Successfully updated the user' });
      res.status(403).json({ error: 'Already updated or failed to update due to invalid user' });
    })
    .catch((err) => res.status(403).json({ error: 'Failed to update the user' }));
};

exports.getUserSkills = (req, res) => {
  const { id } = req.params;

  User.findAll({ where: { id }, include: ['Skill'] })
    .then((user) => {
      user[0] ? res.json(user[0]['Skill']) : res.status(404).json({ error: 'User is not found' });
    })
    .catch((err) => res.status(403).json({ error: 'Cannot get user skills' }));
};

exports.addUserSkill = (req, res) => {
  const { skill_id } = req.params;
  const { user } = res.locals;

  db['Skill'].findOne({ where: { id: skill_id } })
    .then((skill) => {
      user.addSkill(skill)
        .then(() => res.json({ success: 'Successfully added the skill' }))
        .catch((err) => res.status(403).json({ error: 'Cannot add the skill' }));
    })
    .catch((err) => res.status(404).json({ error: 'Skill is not found' }));
};

exports.removeUserSkill = (req, res) => {
  const { id, skill_id } = req.params;

  db['User_Skill'].destroy({ where: { user_id: id, skill_id } })
    .then((removedSkill) => {
      removedSkill ?
        res.json({ success: 'Successfully removed the skill from the user' }) :
        res.status(404).json({ error: 'Skill is not found from the user' });
    })
    .catch(err => res.json({ error: 'Failed to remove the skill from the user' }));
};
