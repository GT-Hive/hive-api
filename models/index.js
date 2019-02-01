'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/db.js');
const sequelize = new Sequelize(config.database, config.username, config.password, config.options);
const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// define many-to-many rel between User & Skill
db['User'].belongsToMany(db['Skill'], {
  as: 'Skill',
  through: 'User_Skill',
  sourceKey: 'skill_id',
  foreignKey: 'user_id',
});
db['Skill'].belongsToMany(db['User'], {
  as: 'User',
  through: 'User_Skill',
  sourceKey: 'user_id',
  foreignKey: 'skill_id',
});

// define many-to-many rel between User & Interest
db['User'].belongsToMany(db['Interest'], {
  as: 'Interest',
  through: 'User_Interest',
  sourceKey: 'interest_id',
  foreignKey: 'user_id',
});
db['Interest'].belongsToMany(db['User'], {
  as: 'User',
  through: 'User_Interest',
  sourceKey: 'user_id',
  foreignKey: 'interest_id',
});

// define has-one rel between Community & Interest
db['Community'].belongsTo(db['Interest'], {
  foreignKey: 'interest_id',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
