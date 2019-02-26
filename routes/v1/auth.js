'use strict';

const db = require('../../models');
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
  const {
    user,
    interests,
  } = req.body;
  const newUser = db.User.build(user);

  newUser
    .save()
    .then(() => {
      db.Interest
        .findAll({
          where: {
            id: interests,
          },
        })
        .then(interests => {
          if (!interests) return res.status(403).json({ error: 'Error occurred while registering' });

          newUser
            .addInterests(interests)
            .then(() => res.json(newUser.toAuthJSON()))
            .catch(err => res.status(403).json({ error: 'Error occurred while registering' }));
        })
        .catch(err => res.status(403).json({ error: 'Error occurred while registering' }));
    })
    .catch(err => {
      const error = typeof err === 'string'
        ?  err
        : (err && err.errors ? err.errors[0].message : 'Error occurred while registering');
      res.status(422).json({ error });
    });
};

exports.confirmToken = (req, res) => {
  const { token } = req.params;

  db.User
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
        res.render('confirmEmail', {
          isConfirmed: false,
          token: encodeURIComponent(token),
        });
      }
    })
    .catch(err => {
      res.render('error', { error: 'Token is invalid or email already has been confirmed' });
    });
};

exports.requestConfirmEmail = (req, res) => {
  const { token } = req.params;
  const { is_api_request } = req.body;
  let { holdUntil } = req.session;
  const today = new Date();
  const holdTimePassed = holdUntil && holdUntil <= today;

  if (!holdUntil || holdTimePassed) {
    // allow one request email up to 3 minutes to avoid brute-force attack
    req.session.holdUntil = today.setSeconds(today.getSeconds() + 180);
    db.User
      .findOne({
        where: {
          confirmed_token: token,
          email_confirmed: false,
        },
      })
      .then(user => {
        user.confirmed_token = user.generateConfirmToken();
        user.save();
        is_api_request
          ? res.json({ success: 'The confirmation email has been sent! Please check your email inbox.' })
          : res.render('resendConfirmEmail');
      })
      .catch(err => {
        const error = 'Email is already confirmed or token is invalid';
        is_api_request
          ? res.status(403).json({ error })
          : res.render('error', { error });
      });
  } else {
    const error = 'It looks like you already verified your email.' +
      'If not, please wait for few minutes to request again.';
    is_api_request
      ? res.status(403).json({ error })
      : res.render('error', { error });
  }
};

exports.resetPassword = (req, res) => {
  const { email } = req.body;
  let { resetHoldUntil } = req.session;
  const today = new Date();
  const holdTimePassed = resetHoldUntil && resetHoldUntil <= today;

  if (!resetHoldUntil || holdTimePassed) {
    // allow one request email up to 3 minutes to avoid brute-force attack
    req.session.resetHoldUntil = today.setSeconds(today.getSeconds() + 180);
    db.User
      .findOne({
        where: {email},
      })
      .then(user => {
        user.resetPassword()
          .then(() => {
            res.json({success: 'Your reset password has been sent to your email.'});
          })
          .catch(err => {
            res.status(403).json({error: 'Something went wrong while resetting your password.'});
          })
      })
      .catch(err => res.status(403).json({error: 'Email is not found.'}));
  } else {
    const error = 'Please wait for few minutes to request again.';
    res.status(403).json({ error });
  }
};
