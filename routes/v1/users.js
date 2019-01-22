const db = require('../../models');
const userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];

exports.getUsers = (req, res) => {
  db.User.findAll({ attributes: userParams }).then((users) => res.json({ users }));
};

exports.getUser = (req, res) => {
  const id = req.params.id;
  db.User.findOne({ where: { id }, attributes: userParams }).then(user => res.json({ user }));
};
