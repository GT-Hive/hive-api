const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../models');
const errorMsg = 'email or password is not valid';

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  db.User.findOne({ where: { email } })
    .then((user) => {
      if (!user) return done(null, errorMsg);

      user.validatePassword(password)
        .then((res) => res === true ? done(user) : done(null, errorMsg))
        .catch((err) => done(null, errorMsg));
    })
    .catch(done);
}));
