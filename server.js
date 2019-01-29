'use strict';

const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const db = require('./models');

require('./config/passport');

app.use(cors());
app.use(
  session({
    secret: process.env.APP_SECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('listening on http://localhost:' + port);

    require('./routes/checkRequest')(app);
    require('./routes/v1')(app, express.Router());
    require('./routes/errorHandlers')(app);
  });
});

module.exports = app;
