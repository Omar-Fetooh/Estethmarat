// function to catch each error on each asyncrouns function
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => next(error));
    // or fn(req , res , next).catch(next)
  };
};

module.exports = catchAsync;
