const Investor = require('./../models/investorModel');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError');

// investor register
exports.register = catchAsync(async (req, res, next) => {
  const newInvestor = await Investor.create(req.body);
  // to prevent send password in response
  newInvestor.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      newInvestor,
    },
  });
});

// get all investors
exports.getAllInvestors = catchAsync(async (req, res, next) => {
  const investors = await Investor.find();
  res.status(200).json({
    status: 'success',
    result: investors.length,
    data: {
      investors,
    },
  });
});

// get investor based on id
exports.getInvestor = catchAsync(async (req, res, next) => {
  const investor = await Investor.findById(req.params.id);
  if (!investor)
    return next(
      new AppError(`there in no investor with that id (${req.params.id})`, 404)
    );
  res.status(200).json({
    status: 'success',
    data: {
      investor,
    },
  });
});

// update investor based on id
exports.updateInvestor = catchAsync(async (req, res, next) => {
  const investor = await Investor.findOne({ _id: req.params.id });
  if (!investor)
    return next(
      new AppError(`there is no investor with that id (${req.params.id})`)
    );
  const updatedInvestor = await Investor.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedInvestor,
    },
  });
});

// delete investor based on id
exports.deleteInvestor = catchAsync(async (req, res, next) => {
  const investor = await Investor.findById(req.params.id);
  if (!investor)
    return next(
      new AppError(`there is no investor with that id (${req.params.id})`)
    );
  await Investor.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});