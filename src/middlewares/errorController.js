import { AppError } from '../Utils/index.js';

// handle cast error
const handleCastError = (err) => {
  return new AppError(`invalid id ${err.value}, please provide valid id`, 400);
};

// handle duplication error
const handelDuplicationError = (err) => {
  const message = err.errorResponse.errmsg.match(/\{([^}]+)\}/)[1];
  return new AppError(`duplication error: ${message}`, 400);
};

// handle validation error
const handleValidationError = (err) => {
  let arr = [];
  for (let obj of Object.values(err.errors)) arr.push(obj.properties.message);
  return new AppError(`${arr.join()}`, 400);
};

// handle expired error
const handleExpiredError = (err) => {
  return new AppError(
    'your token has been expired. please loginin again!',
    401
  );
};

// handle json web token error
const handleJsonWebTokenError = (err) => {
  return new AppError('invalid signature of jwt, please login in again!', 401);
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
    // send error in development
    sendDevError(err, res);
    // send error in production
  } else if (process.env.NODE_ENV === 'production') {
    // handle cast error
    if (err.name === 'CastError') err = handleCastError(err);
    // handle duplaction error
    if (err.code === 11000) err = handelDuplicationError(err);
    // handle validation error
    if (err.name === 'ValidationError') err = handleValidationError(err);
    // handel expired error
    if (err.name === 'TokenExpiredError') err = handleExpiredError(err);
    // handle json web token error
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError(err);
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
