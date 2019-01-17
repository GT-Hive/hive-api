module.exports = function(app, db) {
  app.get('/users', (req, res) => {
    res.send('Hello');
  });
};
