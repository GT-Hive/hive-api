module.exports = (app) => {
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
};
