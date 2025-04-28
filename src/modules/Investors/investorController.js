import jwt from 'jsonwebtoken';
import { Deal, Investor } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { createTokenAndSendCookie } from '../auth/authController.js';
import { APIFEATURES } from '../../Utils/apiFeatures.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';

// investor register
export const register = errorHandler(async (req, res, next) => {
  // register new investor
  const newInvestor = await Investor.create(req.body);
  // create token
  const token = createTokenAndSendCookie(
    newInvestor._id,
    newInvestor.role,
    res
  );
  // to prevent send password in response
  newInvestor.password = undefined;
  // send response
  res.status(201).json({
    status: 'success',
    data: {
      newInvestor,
      token,
    },
  });
});

// get all investors
export const getAllInvestors = errorHandler(async (req, res, next) => {
  const obj = new APIFEATURES(req.query, Investor.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const investors = await obj.query;
  res.status(200).json({
    status: 'success',
    result: investors.length,
    data: {
      investors,
    },
  });
});

// get investor based on id
export const getInvestor = errorHandler(async (req, res, next) => {
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
export const updateInvestor = errorHandler(async (req, res, next) => {
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
export const deleteInvestor = errorHandler(async (req, res, next) => {
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
// get top three investors based on their points
export const getTopInvestors = errorHandler(async (req, res, next) => {
  const topInvestors = await Investor.aggregate([
    {
      $sort: { points: -1 },
    },
    {
      $project: {
        fullArabicName: 1,
        profilePhoto: 1,
        jobTitle: 1,
        points: 1,
        _id: 0,
      },
    },
    {
      $limit: 3,
    },
  ]);
  res.status(200).json({
    status: 'success',
    topInvestors,
  });
});

// get all investors invested in specific company
export const getAllInvestorsInvestedInCompany = errorHandler(
  async (req, res, next) => {
    const { companyId } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'companyId is required' });
    }

    const deals = await Deal.find({ companyId, status: 'Approved' }).populate(
      'investorId'
    );
    console.log(deals);

    const investors = deals.map((deal) => deal.investorId);

    res.status(200).json({
      status: 'success',
      investors,
    });
  }
);
