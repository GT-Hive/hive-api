'use strict';

const expJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const getTokenFromHeaders = req => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: expJwt({
    secret: process.env.JWT_REQUIRED_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: expJwt({
    secret: process.env.JWT_OPTIONAL_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  generateJWT: (id, email) => {
    return jwt.sign(
      {
        id,
        email,
      },
      process.env.JWT_REQUIRED_SECRET,
      { expiresIn: '12h' }
    );
  },
  getUserIdFromToken: req => {
    return jwt.verify(
      getTokenFromHeaders(req),
      process.env.JWT_REQUIRED_SECRET,
      (err, decoded) => {
        if (!err) return decoded.id;
      }
    );
  },
};

module.exports = auth;
