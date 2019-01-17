module.exports = function(app, db) {
  app.get('/users', (req, res) => {
    db.User.findAll().then(function(users) {
      res.json({ users: users });
    });
  });
};
