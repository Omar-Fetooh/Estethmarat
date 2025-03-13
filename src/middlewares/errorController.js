import { AppError } from '../Utils/index.js';
// handle cast error
const handleCastError = (err) => {
  return new AppError(`can't convert ${err.value} into a valid id`, 400);
};
// handle dublicate error
const handleDublicateError = (err) => {
  const regex = /\{([^}]+)\}/;
  const msg = err.errorResponse.errmsg;
  return new AppError(`Dublication error in ${msg.match(regex)[1]}`, 400);
};
// handle validation error
const handleValidationError = (err) => {
  // push all messages error to this array
  let arr = [];
  for (let ele of Object.values(err.errors)) {
    arr.push(ele.properties.message);
  }
  const msgs = arr.join(',');
  return new AppError(msgs, 400);
};
// handle expiration date of jwt
const handelExpirationToken = (err) => {
  return new AppError('Your token has been expired, please login again', 401);
};
// handle invalid signature for jwt
const handleInvalidSignature = (err) => {
  return new AppError('Invalid signature of jwt, please login again', 401);
};
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
export const globalMiddleware = (err, req, res, next) => {
  // set values if not exists
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // send error in development
  if (process.env.NODE_ENV === 'development') {
    // send error in development=
    sendDevError(err, res);
    // send error in production
  } else if (process.env.NODE_ENV === 'production') {
    // 1) handle cast error
    if (err.name === 'CastError') {
      err = handleCastError(err);
    }
    // 2) handle dublicate error
    if (err.code === 11000) err = handleDublicateError(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    if (err.name === 'TokenExpiredError') err = handelExpirationToken(err);
    if (err.name === 'JsonWebTokenError') err = handleInvalidSignature(err);
    if (err.isOperational) {
      // if error is operational
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
