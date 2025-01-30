const app = require('./../app');

// error in development
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// error in production
const sendProdError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

// global error handing midleware
module.exports = (err, req, res, next) => {
  // set values if not exists
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // send error in development
  if (process.env.NODE_ENV === 'development') {
    // send error in development
    sendDevError(err, res);
    // send error in production
  } else if (process.env.NODE_ENV === 'production') {
    // if error is operational
    if (err.isOperational) {
      // send error in production
      sendProdError(err, res);
      // send generic message
    } else {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong',
      });
    }
  }
};
