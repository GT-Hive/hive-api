const User = require('../../models').User;
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
  if (res.locals.userId !== parseInt(id)) return res.status(404).json({ error: 'Forbidden request' });

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
  if (res.locals.userId !== parseInt(id)) return res.status(404).json({ error: 'Forbidden request' });

  User.update({ first_name, last_name, intro, profile_img }, { where: { id } })
    .then((result) => {
      if (result[0] > 0) return res.json({ success: 'Successfully updated the user' });
      res.status(403).json({ error: 'Already updated or failed to update due to invalid user' });
    })
    .catch((err) => res.status(403).json({ error: 'Failed to update the user' }));
};
