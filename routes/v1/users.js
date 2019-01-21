const db = require('../../models');

exports.getUsers = (req, res) => {  
  db.User.findAll().then(function (users) {
    res.json({ users: users });
  });
};

exports.getUser = (req, res) => {
  const id = req.params.id;
  db.User.findById(id).then(user => {
    res.json({ user });
  });
};

exports.userParams = ['id', 'email', 'first_name', 'last_name', 'intro', 'profile_img'];
