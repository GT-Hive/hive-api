/* jshint indent: 2 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const gtEmail = '@gatech.edu';

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        contains: {
          args: gtEmail,
          msg: 'email must be from gatech.edu'
        },
        len: {
          args: [gtEmail.length + 1],
          msg: 'email must have a username with gatech.edu'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: 'password must be at least 6 characters'
        }
      }
    },
    email_confirmed: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    confirmed_token: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'first name must be at least 2 and at most 50 characters'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'last name must be at least 2 and at most 50 characters'
        }
      }
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_img: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
      tableName: 'User'
    });

  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  }

  User.prototype.toAuthJSON = function() {
    const today = new Date();
    const exp = new Date(today).setHours(today.getHours() + 12);
    const token = generateJWT();
    return { token, exp }
  }

  User.beforeCreate(function(user, options) {
    return bcrypt.hash(user.password, saltRounds)
      .then(hash => user.password = hash)
      .catch(err => err);
  });

  return User;
};

generateJWT = function() {
  return jwt.sign({
    id: this.id,
    email: this.email,
  }, process.env.JWT_REQUIRED_SECRET, { expiresIn: '12h' });
}
