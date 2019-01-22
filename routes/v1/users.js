const db = require('../../models');
const userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];

exports.getUsers = (req, res) => {
  db.User.findAll({ attributes: userParams }).then(function (users) {
    res.json({ users: users });
  });
};

exports.getUser = (req, res) => {
  const id = req.params.id;
  db.User.findOne({ where: { id }, attributes: userParams }).then(user => {
    res.json({ user });
  });
};
