'use strict';

const User = require('../../models').User;
const passport = require('passport');

exports.login = (req, res, next) => {
  const {
    user: { email, password },
  } = req.body;

  if (
    !email ||
    (email && !email.includes('@gatech.edu')) ||
    password.length < 6
  ) {
    return res.status(404).json({ error: 'email or password is not valid' });
  }
  passport.authenticate('local', { session: false }, (user, error) => {
    !user || error ? res.status(404).json({ error }) : res.json(user.toAuthJSON());
  })(req, res, next);
};

exports.register = (req, res) => {
  const { user } = req.body;
  const newUser = User.build(user);

  newUser
    .validate()
    .then(() => {
      newUser
        .save()
        .then(() => res.json(newUser.toAuthJSON()))
        .catch(err => {
          const error =
            err && err.errors ? err.errors[0].message : 'an error occurred while registering';
          res.status(422).json({ error });
        });
    })
    .catch(err => {
      const error =
        err && err.errors ? err.errors[0].message : 'an error occurred while registering';
      res.status(422).json({ error });
    });
};

exports.confirmToken = (req, res) => {
  const { token } = req.params;

  User
    .findOne({
      where: {
        confirmed_token: token,
        email_confirmed: false,
      },
    })
    .then(user => {
      const tokenDate = new Date(user.updated_at);
      const exp = tokenDate.setHours(tokenDate.getHours() + 12);
      const today = new Date();

      if (today < exp) {
        user.email_confirmed = true;
        user.save();
        res.render('confirmEmail', { isConfirmed: true });
      } else {
        res.render('confirmEmail', { isConfirmed: false, token });
      }
    })
    .catch(err => {
      res.render('error', { err: 'Token is invalid or email already has been confirmed' });
    });
};

exports.requestConfirmEmail = (req, res) => {
  const { token } = req.params;
  let { holdUntil } = req.session;
  const today = new Date();
  const holdTimePassed = holdUntil && holdUntil <= today;

  if (!holdUntil || holdTimePassed) {
    // allow one request email up to 3 minutes to avoid brute-force attack
    req.session.holdUntil = today.setSeconds(today.getSeconds() + 180);
    User
      .findOne({
        where: {
          confirmed_token: token,
          email_confirmed: false,
        },
      })
      .then(user => {
        user.confirmed_token = user.generateConfirmToken();
        user.save();
        res.render('resendConfirmEmail');
      })
      .catch(err => {
        res.render('error', {
          err: 'Confirmation is already validated or token is invalid',
        });
      });
  } else {
    res.render('error', {
      err: 'It looks like you already verified your email. If not, please wait for 3 minutes to request again.',
    });
  }
};
