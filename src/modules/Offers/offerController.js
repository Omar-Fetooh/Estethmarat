import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { Company, Investor, Offer } from '../../../DB/models/index.js';

export const createOffer = errorHandler(async (req, res, next) => {
  // console.log(req);

  const { companyId } = req.query;
  // console.log(companyId);

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError('invalid company id ', 404));
  }

  const investorId = req.user._id;
  const isValidInvestor = await Investor.findById(investorId);

  // console.log(investorId, isValidInvestor);

  if (!isValidInvestor) return next(new AppError('invalid investor', 404));

  req.body.company = companyId;
  req.body.investor = investorId;
  // req.body.investor = investorId;
  // console.log(req.body);

  const offer = await Offer.create(req.body);
  // send response
  res.status(201).json({
    status: 'success',
    data: {
      offer,
    },
  });
});

// get all questions
export const getAllOffers = errorHandler(async (req, res, next) => {
  // get all questions
  const questions = await Offer.find();
  // send response
  res.status(200).json({
    status: 'success',
    result: questions.length,
    data: {
      questions,
    },
  });
});

// get question based on id
export const getOffer = errorHandler(async (req, res, next) => {
  // get question based on id
  const question = await Offer.findById(req.params.questionId);
  // check if there is question with that id
  if (!question)
    return next(new AppError('there no question with that id', 404));
  // send response
  res.status(200).json({
    status: 'success',
    data: {
      question,
    },
  });
});

// update offer based on id
export const updateOffer = errorHandler(async (req, res, next) => {
  // check if ther is offer with that id
  const offer = await Offer.findById(req.params.offerId);
  if (!offer) return next(new AppError('there is no offer with that id', 404));

  const companyId = req.user._id;
  if (companyId.toString() !== offer.company.toString()) {
    console.log(555555555,companyId,offer.company);
    
    return next(new AppError("You don't have permission to do this ", 404));
  }

  // update offer based on id
  const updatedOffer = await Offer.findByIdAndUpdate(
    req.params.offerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  updatedOffer.companySeen = true;
  updatedOffer.companyResponded = true;

  updatedOffer.save();
  // send response
  res.status(200).json({
    status: 'success',
    data: {
      updatedOffer,
    },
  });
});

// delete question based on id
export const deleteOffer = errorHandler(async (req, res, next) => {
  // check if there is question with that id
  const question = await Offer.findById(req.params.questionId);
  if (!question)
    return next(new AppError('there is no question with that id', 404));
  // delete question based on id
  await Offer.findByIdAndDelete(req.params.questionId);
  // send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
