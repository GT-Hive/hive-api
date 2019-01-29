'use strict';

const url = require('url');
const jwtAuth = require('../config/jwtAuth');
const User = require('../models').User;

module.exports = app => {
  app.use((req, res, next) => {
    const requireConfirmedEmail = !url
      .parse(req.url)
      .pathname.includes('/auth');
    const id = jwtAuth.getUserIdFromToken(req);

    if (requireConfirmedEmail && id) {
      User.findOne({ where: { id, email_confirmed: true } })
        .then(user => {
          if (!user)
            return res.status(401).json({ error: 'Unauthorized access' });
          res.locals.userId = id;
          res.locals.user = user;
          next();
        })
        .catch(_err => {
          return res.status(401).json({ error: 'Unauthorized access' });
        });
    } else {
      next();
    }
  });
};
