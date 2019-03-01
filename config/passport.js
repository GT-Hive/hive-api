'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models').User;
const errorMsg = 'email or password is not valid';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    (email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return done(null, errorMsg);
          if (!user.email_confirmed) return done(null, 'Email is not verified yet.');

          user
            .validatePassword(password)
            .then(res => (res === true ? done(user) : done(null, errorMsg)))
            .catch(err => done(null, errorMsg));
        })
        .catch(done);
    }
  )
);
