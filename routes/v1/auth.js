const User = require('../../models').User;
const passport = require('passport');

exports.login = (req, res, next) => {
  const { user: { email, password } } = req.body;

  if (!email || (email && !email.includes('@gatech.edu')) || password.length < 6) {
    return res.status(404).json({ error: 'email or password is not valid' });
  }

  return passport.authenticate('local', { session: false }, (user, error) => {
    if (error) return next(error);

    !user ? res.status(404).json({ error }) : res.json(user.toAuthJSON());
  })(req, res, next);
};

exports.register = (req, res) => {
  const { user } = req.body;

  const newUser = User.build(user);
  newUser.validate()
    .then(() => {
      newUser.save()
        .then(() => res.json(newUser.toAuthJSON()))
        .catch((err) => {
          const error = err && err.errors ? err.errors[0].message : 'an error occurred while registering';
          res.status(422).json({ error });
        });
    })
    .catch((err) => {
      const error = err && err.errors ? err.errors[0].message : 'an error occurred while registering';
      res.status(422).json({ error });
    });
};
