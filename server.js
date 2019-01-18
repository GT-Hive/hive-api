const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const db = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('listening on http://localhost:' + port);

    require('./routes/v1')(app, express.Router());

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    // no stacktraces leaked to user unless in development environment
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
      });
    });
  });
});
