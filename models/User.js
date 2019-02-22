'use strict';

const bcrypt = require('bcrypt');
const jwt = require('../config/jwtAuth');
const saltRounds = 10;
const gtEmail = '@gatech.edu';
const emailSender = require('../lib/emailSender');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          contains: {
            args: gtEmail,
            msg: 'email must be from gatech.edu',
          },
          len: {
            args: [gtEmail.length + 1],
            msg: 'email must have a username with gatech.edu',
          },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [6],
            msg: 'password must be at least 6 characters',
          },
        },
      },
      email_confirmed: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0',
      },
      confirmed_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: 'first name must be at least 2 and at most 50 characters',
          },
        },
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: 'last name must be at least 2 and at most 50 characters',
          },
        },
      },
      intro: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profile_img: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'User',
    }
  );

  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toAuthJSON = function() {
    const today = new Date();
    const exp = new Date(today).setHours(today.getHours() + 12);
    const id = this.id;
    const token = jwt.generateJWT(id, this.email);
    return {
      token,
      exp,
      id,
    };
  };

  User.prototype.generateConfirmToken = function() {
    const token = _generateConfirmToken(this.email);
    _sendConfirmEmail(this.email, token);
    return token;
  };

  User.prototype.resetPassword = function() {
    const randomPassword = _getRandomPassword(8);
    return bcrypt
      .hash(randomPassword, saltRounds)
      .then(hash => {
        this.password = hash;
        this.save()
          .then(() => {
            emailSender.sendResetPasswordEmail(this.email, randomPassword);
          })
          .catch(err => err);
      })
      .catch(err => err);
  };

  // generate email confirm token & send email before creating a user
  User.beforeCreate(function(user, options) {
    user.confirmed_token = _generateConfirmToken(user.email);
    return bcrypt
      .hash(user.password, saltRounds)
      .then(hash => (user.password = hash))
      .catch(err => err);
  });

  User.afterCreate(function(user, options) {
    _sendConfirmEmail(user.email, user.confirmed_token);
  });

  return User;
};

const _generateConfirmToken = email => {
  const buf = require('crypto').randomBytes(64);
  return buf.toString('base64');
};

const _sendConfirmEmail = (email, token) => {
  emailSender.sendConfirmEmail(email, encodeURIComponent(token));
};

const _getRandomPassword = length => {
  const chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
  const pass = [];
  for (let i = 0; i < length; i++) {
    pass[i] = chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass.join('');
};
