const express    = require("express");
const app        = express();
const port       = process.env.PORT || 5000;
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const db = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app, db);

db.sequelize.sync().then(function() {
  app.listen(port, function () {
    console.log('listening on http://localhost:' + port);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});
